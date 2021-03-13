import type { IFormResponseHandler, FormInstance } from "../framework";
import type { FormResponse } from "../server";

export class FormComponentResponseHandler implements IFormResponseHandler {
	public readonly name: string = "default";

	public handle(response: FormResponse, form: FormInstance): Promise<void> {
		return Promise.resolve();
	}
}
