import type { ControlRegister } from "./ControlRegister";
import type { IAppRouter } from "./IAppRouter";
import type { IFormResponseHandler } from "./IFormResponseHandler";
import type { UimfServer } from "./UimfServer";
import type { MenuItem } from "./MenuItem";
import { FormInstance } from "./FormInstance";
import { FormMetadata, ClientFunctionMetadata } from "../server";

export class UimfApp {
	public forms: FormMetadata[];
	public menu: MenuItem;
	private formsById: { [id: string]: FormMetadata } = {};
	private eventHandlers: any[] = [];
	public readonly server: UimfServer;
	public readonly formResponseHandlers: { [id: string]: IFormResponseHandler } = {};
	public controlRegister: ControlRegister;
	public router: IAppRouter;
	
	public showModal: (component, props) => void = (component, props) => {
		console.error("Cannot show modal, because `showModal` function is not configured.");
	};
	
	public closeModal: () => void = () => {
		console.error("Cannot close modal, because `closeModal` function is not configured.");
	};

	public showToast: (args) => void = (args) => {
		console.error("Cannot show toast, because `showToast` function is not configured.");
	};

	constructor(server: UimfServer, controlRegister: ControlRegister) {
		this.server = server;
		this.controlRegister = controlRegister;

		for (const e of ["request:started", "request:completed"]) {
			this.server.on(e, (params) => {
				this.fire(e, params);
			});
		}
	}

	public on(event: string, handler: (params: any) => void): void {
		this.eventHandlers[event] = this.eventHandlers[event] || [];
		this.eventHandlers[event].push(handler);
	}

	private fire(event: string, params: any): void {
		const handlersForEvent = this.eventHandlers[event];
		if (handlersForEvent != null && handlersForEvent.length > 0) {
			for (const handler of handlersForEvent) {
				handler(params);
			}
		}
	}

	public useRouter(router: IAppRouter): void {
		this.router = router;
		this.fire("app:router-assigned", null);
	}

	public registerResponseHandler(handler: IFormResponseHandler): void {
		this.formResponseHandlers[handler.name] = handler;
	}

	public async load(): Promise<void> {
		const response = await this.server.getAllMetadata();

		this.forms = response.Forms;
		this.menu = response.Menu;
		this.formsById = {};

		for (const form of this.forms) {
			this.formsById[form.Id] = new FormMetadata(form);
		}

		this.fire("app:loaded", null);
	}

	public getForm(id: string, throwError: boolean = false): FormMetadata {
		var value = this.formsById[id];

		if (value == null && throwError){
			throw Error(`Form ${id} not found.`);
		}

		return value;
	}

	public getFormInstance(formId: string, throwError: boolean = false): FormInstance {
		const metadata = this.getForm(formId, throwError);

		if (metadata == null) {
			return null;
		}

		return new FormInstance(metadata, this);
	}

	public runFunctions(functionMetadata: ClientFunctionMetadata[], eventArgs?: any): Promise<any> {
		if (functionMetadata == null) {
			return Promise.resolve();
		}

		const promises = [];
		for (const f of functionMetadata) {
			const handler = this.controlRegister.functions[f.Id];

			if (handler == null) {
				throw new Error(`Could not find function '${f.Id}'.`);
			}

			const promise = handler.run(f, eventArgs);
			promises.push(promise);
		}

		return Promise.all(promises);
	}
}
