import type { UimfApp } from "../framework";

export class RouteParameterBuilder {
	public readonly parameterName: string;
	public currentForm: string;
	private app: UimfApp;

	constructor(parameterName: string, app: UimfApp) {
		this.app = app;
		this.parameterName = parameterName;
	}

	public buildFormRouteParameters(formId: string, values: any, keepDiscriminatorUnchanged: boolean = false): any {
		const formMetadata = this.app.getForm(formId);

		values = values || {};
		const normalizedValues = {};
		for (const prop of Object.keys(values)) {
			normalizedValues[prop.toLowerCase()] = values[prop];
		}

		const urlParams = {};
		formMetadata.InputFields.forEach(inputFieldMetadata => {
			var input = this.app.controlRegister.createInputController(inputFieldMetadata);
			var value = normalizedValues[inputFieldMetadata.Id.toLowerCase()];

			var serializedValue = input.serialize(value);

			if (serializedValue != null) {
				urlParams[inputFieldMetadata.Id] = serializedValue;
			}
		});

		if (keepDiscriminatorUnchanged) {
			urlParams[this.parameterName] = RouteParameterBuilder.parseQueryStringParameters(location.pathname)[this.parameterName];
		}
		else if (formId === this.currentForm) {
			const d = RouteParameterBuilder.parseQueryStringParameters(location.pathname)[this.parameterName] || 0;
			const dAsNumber = parseInt(d, 10);
			urlParams[this.parameterName] = isNaN(dAsNumber) ? 0 : dAsNumber + 1;
		}

		return { ...urlParams, _id: formId };
	}

	public static parseQueryStringParameters(url: string): any {
		const queryStartsAt = url.indexOf("?");

		const result = {};

		// If there is a query string.
		if (queryStartsAt !== -1 && url.length > queryStartsAt) {
			url.substr(queryStartsAt + 1).split("&").filter((t) => {
				const value = t.split("=");
				result[value[0]] = decodeURIComponent(value[1]);
			});
		}

		return result;
	}
}
