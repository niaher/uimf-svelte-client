import type { EventHandlerMetadata } from "../server";
import type { InputController } from "./InputController";

export abstract class InputFieldEventHandler {
	public id: string;

	public abstract run(
		input: InputController<any>,
		eventHandlerMetadata: EventHandlerMetadata,
		args: any): Promise<InputController<any>>;
}
