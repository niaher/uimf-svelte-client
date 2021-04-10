import abstractStateRouter from "abstract-state-router";
import svelteStateRenderer from "svelte-state-renderer";
import sausageRouter from "sausage-router";
import hashBrownRouter from "hash-brown-router";
import { RouteParameterBuilder } from "./RouteParameterBuild";
import type { IAppRouter, UimfApp } from "../framework";
import EventSource from "../framework/EventManager";
import CaseInsensitiveDictionary from "./CaseInsensitiveDictionary";

type ResolveCallback = (error: boolean, content: any) => string;

export class AppRouter extends EventSource implements IAppRouter {
	private readonly stateRenderer: any;
	public readonly stateRouter: any;
	private readonly element: HTMLElement;
	private readonly rpb: RouteParameterBuilder;
	private readonly app: UimfApp;

	constructor(element: HTMLElement, app: UimfApp, formComponent, defaultForm: string) {
		super();

		this.element = element;
		this.app = app;
		this.stateRenderer = svelteStateRenderer({});
		this.stateRouter = abstractStateRouter(this.stateRenderer, this.element, {
			pathPrefix: '',
			router: hashBrownRouter(sausageRouter())
		});

		const rpb = this.rpb = new RouteParameterBuilder("_", app);
		const self = this;

		this.stateRouter.addState({
			name: "form",
			data: {},
			route: "/form/:_id",
			template: formComponent,

			// Force route reload when value of "_" parameter changes. This is
			// needed because by default the router will not reload route even if
			// any of the parameters change, unless they are specified in "querystringParameters".
			// This means that if we are trying to reload same form, but with different parameters,
			// nothing will happen, unless "_" changes too.
			querystringParameters: [rpb.parameterName],
			defaultParameters: { [rpb.parameterName]: "" },

			activate(context: any): void {
				rpb.currentForm = context.parameters._id;
				context.on("destroy", () => rpb.currentForm = null);
				self.fire("router:activated", null);
			},
			resolve(data: any, parameters: any, cb: ResolveCallback): void {
				const formInstance = app.getFormInstance(parameters._id, true);
				formInstance.setInputFields(parameters).then(() => {
					cb(false, {
						form: formInstance,
						app
					});
				});
			}
		});

		this.stateRouter.on(
			"stateChangeEnd",
			() => self.fire('stateChangeEnd', null)
		);

		app.on("app:loaded", () => {
			this.stateRouter.evaluateCurrentRoute("form", { _id: defaultForm });
		});
	}

	public getUrlParams(): any {
		return RouteParameterBuilder.parseQueryStringParameters(location.pathname + location.search);
	};

	public setFormUrlParams(params: any): void {
		var active = this.stateRouter.getActiveState();
		this.stateRouter.go("form", { ...params, _id: active.parameters._id });
	}

	public go(form: string, params: any, keepDiscriminatorUnchanged: boolean = false): void {
		this.stateRouter.go("form", this.rpb.buildFormRouteParameters(form, params, keepDiscriminatorUnchanged));
	}

	public goToUrl(u: string | URL): Promise<void> {
		const url = typeof (u) === "string" ? new URL(u) : u;
		const urlPrefix = "/form/";

		if (!url.pathname.startsWith(urlPrefix)) {
			window.location.href = url.href;
			return Promise.resolve();
		}

		const form = url.pathname.substring(urlPrefix.length);
		const queryStringParams = RouteParameterBuilder.parseQueryStringParameters(url.pathname);
		const queryStringParamsDic = new CaseInsensitiveDictionary(queryStringParams);

		const inputFieldValues = {};
		const metadata = this.app.getForm(form);

		var promises = metadata.InputFields.map(inputFieldMetadata => {
			var input = this.app.controlRegister.createInputController(inputFieldMetadata);
			var value = queryStringParamsDic.getByKey(inputFieldMetadata.Id);

			return input.deserialize(value).then(t => inputFieldValues[inputFieldMetadata.Id] = t);
		});

		return Promise.all(promises).then(() => this.go(form, inputFieldValues, false));
	}

	public makeUrl(form: string, params: any, keepDiscriminatorUnchanged: boolean = false): string {
		return this.stateRouter.makePath("form", this.rpb.buildFormRouteParameters(form, params, keepDiscriminatorUnchanged));
	}

	public getCurrentFormId(): string {
		const urlPrefix = "/form/";
		var formIdStartAt = location.pathname.indexOf(urlPrefix);
		if (formIdStartAt === -1) {
			return null;
		}

		return location.pathname.substring(formIdStartAt + urlPrefix.length);
	}
}
