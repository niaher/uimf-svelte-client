import { FormEventArguments, OutputController, OutputFieldEventHandler } from "../../framework";
import type { EventHandlerMetadata } from "../../server";

export class OutputLogToConsole extends OutputFieldEventHandler {
	public run(
		output: OutputController,
		eventHandlerMetadata: EventHandlerMetadata,
		args: FormEventArguments): Promise<void> {
		// tslint:disable-next-line:no-console
		console.log(`[${eventHandlerMetadata.RunAt}] output event handler '${eventHandlerMetadata.Id}' from '${output.metadata.Id}'`);
		return Promise.resolve();
	}
}
