import type { OutputFieldMetadata } from "../server";
import EventSource from "./EventManager";

/**
 * Controller for an output field. Each output field in a form will have `OutputController assigned to it
 * so that output fields can be managed via a consistent API.
 */
export class OutputController extends EventSource {

	constructor(
		metadata: OutputFieldMetadata,
		data: any) {
		super();
		this.metadata = metadata;
		this.data = data;
	}

	public metadata: OutputFieldMetadata;

	/**
	 * Value of the output field.
	 */
	public data: any;

	/**
	 * Sets output field's value.
	 * @param data New value for the output field.
	 */
	public setData(data: any) {
		this.data = data;

		this.fire("changed", this);
	}	
}
