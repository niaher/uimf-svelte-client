import { FormMetadata, FormResponse } from "../server";
import type { InputController } from "./InputController";
import { OutputController } from "./OutputController";
import type { UimfApp } from "./UimfApp";

export class FormInstance {
	public readonly metadata: FormMetadata;
	public app: UimfApp;
	public outputs: Record<string, OutputController> = {};
	public inputs: Record<string, InputController<any>> = {};
	public response: FormResponse;
	public parentForm: FormInstance = null;

	private eventHandlers: {} = {};
	private eventHandlerCounter = 0;

	constructor(metadata: FormMetadata, app: UimfApp) {
		this.metadata = new FormMetadata(metadata);
		this.app = app;

		this.metadata.InputFields.forEach(input => {
			var inputController = this.inputs[input.Id] = app.controlRegister.createInputController(input);

			var eventHandlers = input.EventHandlers || [];
			eventHandlers.forEach(event => {
				this.on(event.RunAt, async function (params) {
					var handler = app.controlRegister.inputFieldEventHandlers[event.Id];

					if (handler == null) {
						throw 'Cannot find input event handler "' + event.Id + '".';
					}

					await handler.run(inputController, event, params);
				});
			});
		});

		this.metadata.OutputFields.forEach(output => {
			this.outputs[output.Id] = new OutputController(output, null);
		});
	}

	private enforceCanPostOnLoad(): void {
		// If user is trying to auto-submit a form which is not enabled for `PostOnLoad`.
		if (!this.metadata.PostOnLoad) {
			throw new Error(`Invalid invocation of form '${this.metadata.Id}'. Form cannot be auto-posted, because *PostOnLoad* is set to false.`);
		}
	}

	public async getUrlParams(): Promise<any> {
		var urlParams = {};
		var self = this;

		// Sort inputs alphabetically, so that URL query parameters are rendered consistently.
		// Generating consistent URLs is important to ensure predictable navigation and to avoid
		// double-post and double-entry in browser's navigation history.
		var promises = Object.keys(this.inputs).sort().map(inputId => {
			var input = self.inputs[inputId];

			return input.getValue().then(function (value) {
				var inputMetadata = self.metadata.InputFields.find(i => i.Id === inputId);
				var ignoreUrl = (inputMetadata.CustomProperties || {}).hasOwnProperty('ignoreUrl');

				if (!ignoreUrl) {
					var serialized = input.serialize(value);
					if (serialized != null) {
						urlParams[inputId] = serialized;
					}
				}
			});
		});

		return Promise.all(promises).then(t => urlParams);
	}

	public async submit(postOnLoad: boolean): Promise<FormResponse> {
		if (postOnLoad) {
			this.enforceCanPostOnLoad();
		}

		var inputData = {};
		var allRequiredInputsHaveValue = true;
		var self = this;

		var inputDataPromises = Object.keys(this.inputs).sort().map(inputId => {
			var input = self.inputs[inputId];
			return input.getValue().then(function (value) {
				inputData[inputId] = value;
				var inputMetadata = self.metadata.InputFields.find(i => i.Id === inputId);

				if (value == null) {
					allRequiredInputsHaveValue = allRequiredInputsHaveValue && !inputMetadata.Required;
				}
			});
		});

		return Promise.all(inputDataPromises).then(async function () {
			if (!allRequiredInputsHaveValue) {
				var skipValidation = postOnLoad && !self.metadata.PostOnLoadValidation;

				if (!skipValidation) {
					return Promise.reject('validation');
				}
			}

			self.response = await self.app.server.postForm(self.metadata.Id, inputData);

			Object.keys(self.response).forEach(function (outputId) {
				// Check if the output is registered in the metadata. If not we don't process it.
				if (self.outputs[outputId] != null) {
					self.outputs[outputId].setData(self.response[outputId]);
				}
			});

			if (self.response.Metadata != null) {
				var customHandler = self.app.formResponseHandlers[self.response.Metadata.Handler];

				if (customHandler != null) {
					await customHandler.handle(self.response, this);
				}
			}

			var functionsToRun = (self.response.Metadata || {}).FunctionsToRun || [];
			functionsToRun.forEach(function (f) {
				var fn = self.app.controlRegister.functions[f.Id];

				if (fn == null) {
					throw 'Cannot find client function "' + f.Id + '".';
				}

				fn.run(f, self.app, self.response);
			});

			await self.fire('form:responseHandled', {
				response: self.response,
				postOnLoad: postOnLoad
			});

			return await Promise.resolve(self.response);
		});
	}

	/**
	 * Sets input field values.
	 * @param data 
	 */
	public async setInputFields(data: any): Promise<void> {
		var promises = this.metadata.InputFields.map(inputFieldMetadata => {
			let value = null;

			if (data != null) {
				var key = Object.keys(data).find(t => t.toLowerCase() == inputFieldMetadata.Id.toLowerCase());
				value = data[key];
			}

			return this.inputs[inputFieldMetadata.Id].setValue(value);
		});

		await Promise.all(promises);
	}

	/**
	 * Gets input field values.
	 * @param data 
	 */
	public async getInputFields(): Promise<any> {
		var data = {};

		var promises = this.metadata.InputFields.map(async inputFieldMetadata => {
			data[inputFieldMetadata.Id] = await this.inputs[inputFieldMetadata.Id].getValue();
		});

		await Promise.all(promises);

		return data;
	}

	public async fire(eventName: string, params: any) {
		var promises = Object.keys(this.eventHandlers)
			.filter(t => t.startsWith(eventName + '#'))
			.map(t => this.eventHandlers[t](params));

		await Promise.all(promises);
	}

	public on(eventName: string, fn: (params) => Promise<void>): () => void {
		this.eventHandlerCounter++;
		var key = eventName + '#' + this.eventHandlerCounter;
		this.eventHandlers[key] = fn;

		return () => delete this.eventHandlers[key];
	}
}
