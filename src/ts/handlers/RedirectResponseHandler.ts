import type { FormResponse } from "../server";
import type { FormInstance, IAppRouter, IFormResponseHandler } from "../framework";

export class RedirectResponseHandler implements IFormResponseHandler {
	public readonly name: string = "redirect";
	private readonly router: IAppRouter;

	constructor(router: IAppRouter) {
		this.router = router;
	}

	public handle(response: IRedirectResponse, form: FormInstance): Promise<void> {
		this.router.go(response.Form, response.InputFieldValues, false);
		return Promise.resolve();
	}
}

interface IRedirectResponse extends FormResponse {
	/**
	 * Gets or sets name of the form to redirect to.
	 */
	Form: string;

	/**
	 * Gets or sets values for the input fields of the form (i.e. - <see cref="FormMetadata.InputFields"/>).
	 */
	InputFieldValues: any;
}
