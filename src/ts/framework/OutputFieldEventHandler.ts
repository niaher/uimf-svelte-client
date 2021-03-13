import type { EventHandlerMetadata } from "../server";
import type { OutputController } from "./OutputController";

export abstract class OutputFieldEventHandler {
	public Id: string;

	public abstract run(
		output: OutputController, 
		eventHandlerMetadata: EventHandlerMetadata, 
		args: any): Promise<void>;
}
