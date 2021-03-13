import type { EventHandlerMetadata } from "./EventHandlerMetadata";
import { InputFieldMetadata } from "./InputFieldMetadata";
import { OutputFieldMetadata } from "./OutputFieldMetadata";

/**
 * Encapsulates all information needed to render a form.
 */
export class FormMetadata {
	constructor(metadata: any) {
		for (var property of Object.keys(metadata)) {
			this[property] = metadata[property];
		}

		this.InputFields = metadata.InputFields.map(t => new InputFieldMetadata(t));
		this.OutputFields = metadata.OutputFields.map(t => new OutputFieldMetadata(t));
	}

	/**
	 * Gets or sets id of the form, to which this metadata belongs.
	 */
	public Id: string;

	/**
	 * Gets or sets list of input fields.
	 */
	public InputFields: InputFieldMetadata[];

	/**
	 * Gets or sets label for this form.
	 */
	public Label: string;

	/**
	 * Gets or sets list of output fields.
	 */
	public OutputFields: OutputFieldMetadata[];

	/**
	 * Gets or sets a value indicating whether the form should be auto-posted as soon as it has been loaded by the client. This can be useful for displaying reports and to generally show data without user having to post the form manually. 
	 */
	public PostOnLoad: boolean;

	/**
	 * Gets or sets value indicating whether the initial post (<see cref="PostOnLoad"/>) should validate all input fields before posting.
	 */
	public PostOnLoadValidation: boolean;

	/**
	 * Gets or sets additional parameters for the client.
	 */
	public CustomProperties: any;

	/**
	 * Gets or sets event handlers for this form.
	 */
	public EventHandlers: EventHandlerMetadata[];

	/**
	 * Gets value of a custom property.
	 * @param name name of the custom property to get.
	 * @returns value of the custom property or null if the property is undefined.
	 */
	public getCustomProperty(name: string): any {
		if (this.CustomProperties != null && this.CustomProperties[name]) {
			return this.CustomProperties[name];
		}

		return null;
	}
}