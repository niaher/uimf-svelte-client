import type { EventHandlerMetadata } from "../server";
import type { FormInstance } from "./FormInstance";

export abstract class FormEventHandler {
	public id: string;

	public abstract run(
		form: FormInstance,
		eventHandlerMetadata: EventHandlerMetadata,
		args: any): Promise<void>;
}
