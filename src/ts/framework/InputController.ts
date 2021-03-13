import type { InputFieldMetadata } from "../server";
import EventSource from "./EventManager";

/**
 * Controller for an input field. Each input in a form will have a controller assigned to it
 * so that the inputs can be managed via a consisten API.
 */
export abstract class InputController<T> extends EventSource {
	public readonly metadata: InputFieldMetadata;

	/**
	 * Input's current value.
	 */
	public value: T;

	constructor(metadata: InputFieldMetadata) {
		super();
		this.metadata = metadata;
	}

	/** 
	 * Sets input value and fires "changed" event afterwards.
	 * @param value Value to set. This value can either be the actual value
	 * or its serialized representation.
	 */
	public setValue(value: T | string): Promise<void> {
		var promise = null;

		if (value == null) {
			this.value = null;
			promise = Promise.resolve();
		}
		else {
			if (typeof (value) === "string" || typeof (value) === "number") {
				promise = this.deserialize(value.toString()).then(t => this.value = t);
			}
			else {
				this.value = value;
				promise = Promise.resolve();
			}
		}

		return promise
			.then(() => this.setValueInternal(this.value))
			.then(() => this.fire('changed', this));
	}

	/** 
	 * This method is called internall by `setValue` and is useful in case additional logic needs to be
	 * applied when input's value is set.
	 * @param value Input's new value.
	 */
	protected setValueInternal(value: T): Promise<void> {
		return Promise.resolve();
	}

	public abstract getValue(): Promise<T>;
	public abstract deserialize(value: string): Promise<T>;
	public abstract serialize(value: T): string;

	public getValueAsString(): Promise<string> {
		return this.getValue().then((t) => {
			return this.serialize(t);
		});
	}
}
