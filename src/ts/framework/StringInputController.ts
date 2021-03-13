import type { InputFieldMetadata } from "../server";
import { InputController } from "./InputController";

export class StringInputController extends InputController<string> {
	constructor(metadata: InputFieldMetadata) {
		super(metadata);
	}

	public deserialize(value: string): Promise<string> {
		return Promise.resolve(value);
	}

	public serialize(value: string | any): string {
		if (typeof (value) !== "string") {
			return value != null ? value.toString() : null;
		}

		// Ensure we don't return "undefined", but return null instead.
		return value != null && value.length > 0 ? value.toString() : null;
	}

	public getValue(): Promise<string> {
		return Promise.resolve(this.value);
	}
}
