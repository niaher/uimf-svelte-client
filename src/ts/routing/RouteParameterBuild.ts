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
		const form = this.app.getFormInstance(formId, true);

		values = values || {};
		const normalizedValues = {};
		for (const prop of Object.keys(values)) {
			normalizedValues[prop.toLowerCase()] = values[prop];
		}

		const urlParams = {};
		form.metadata.InputFields.forEach(inputFieldMetadata => {
			var input = form.inputs[inputFieldMetadata.Id];
			var value = normalizedValues[inputFieldMetadata.Id.toLowerCase()];
			var serializedValue = input.serialize(value);

			if (serializedValue != null) {
				urlParams[inputFieldMetadata.Id] = serializedValue;
			}
		});

		if (keepDiscriminatorUnchanged) {
			urlParams[this.parameterName] = RouteParameterBuilder.parseQueryStringParameters(location.hash)[this.parameterName];
		}
		else if (formId === this.currentForm) {
			const d = RouteParameterBuilder.parseQueryStringParameters(location.hash)[this.parameterName] || 0;
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
