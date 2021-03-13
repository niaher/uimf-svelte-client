import { InputController, InputFieldEventHandler } from "../../framework";
import type { EventHandlerMetadata, FormResponse } from "../../server";

export class BindToOutput extends InputFieldEventHandler {
	public run(
		input: InputController<any>,
		eventHandler: EventHandlerMetadata,
		args: any): Promise<any> {
		const promises = [];
		const lowercaseInputId = eventHandler.CustomProperties.OutputFieldId.toLowerCase();
		var response: FormResponse = args.response;
		
		for (const prop in response) {
			if (response.hasOwnProperty(prop) && prop.toLowerCase() === lowercaseInputId) {
				const promise = input.setValue(response[prop]);

				promises.push(promise);
				break;
			}
		}

		return Promise.all(promises);
	}
}