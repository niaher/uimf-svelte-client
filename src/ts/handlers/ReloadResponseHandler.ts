import type { FormResponse } from "../server";
import type { FormInstance, IFormResponseHandler, UimfApp } from "../framework";

export class ReloadResponseHandler implements IFormResponseHandler {
	public readonly name: string = "reload";
	private readonly app: UimfApp;

	constructor(app: UimfApp) {
		this.app = app;
	}

	public async handle(response: IReloadResponse, form: FormInstance): Promise<void> {
		await this.app.load();

		const url = this.app.router.makeUrl(response.Form, response.InputFieldValues, false);

		window.location.href = url;
	}
}

interface IReloadResponse extends FormResponse {
	/**
	 * Gets or sets name of the form to redirect to.
	 */
	Form: string;

	/**
	 * Gets or sets values for the input fields of the form (i.e. - <see cref="FormMetadata.InputFields"/>).
	 */
	InputFieldValues: any;
}
