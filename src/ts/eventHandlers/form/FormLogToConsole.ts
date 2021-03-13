import { FormEventHandler, FormInstance, FormEventArguments } from "../../framework";
import type { EventHandlerMetadata } from "../../server";

export class FormLogToConsole extends FormEventHandler {
	public run(
		form: FormInstance,
		eventHandlerMetadata: EventHandlerMetadata,
		args: FormEventArguments): Promise<void> {
		// tslint:disable-next-line:no-console
		console.log(`[${eventHandlerMetadata.RunAt}] form event handler '${eventHandlerMetadata.Id}' from '${form.metadata.Id}'`);
		return Promise.resolve();
	}
}
