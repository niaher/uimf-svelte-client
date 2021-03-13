import type { UimfApp } from "./UimfApp";

export class FormEventArguments {
	public app: UimfApp;

	/**
	 * Represents the Form.html component to which the action-list belongs.
	 */
	public form: any;

	constructor(app: UimfApp) {
		this.app = app;
	}
}
