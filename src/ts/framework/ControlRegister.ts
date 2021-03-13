import type { InputFieldMetadata } from "../server";
import type { FormEventHandler } from "./FormEventHandler";
import type { IFunctionRunner } from "./IFunctionRunner";
import type { InputController } from "./InputController";
import type { InputFieldEventHandler } from "./InputFieldEventHandler";
import { OutputControlConfiguration } from "./OutputControlConfiguration";
import type { OutputFieldEventHandler } from "./OutputFieldEventHandler";
import { StringInputController } from "./StringInputController";

interface InputFieldControllerConstructor {
	new(metadata: InputFieldMetadata): InputController<any>;
}

interface InputControlEntry {
	controller: InputFieldControllerConstructor;
	component: any;
	constants: OutputControlConfiguration;
}

interface IOutputControlEntry {
	component: any;
	constants: OutputControlConfiguration;
}

export class ControlRegister {
	public inputs: Record<string, InputControlEntry> = {};
	public outputs: Record<string, IOutputControlEntry> = {};
	public inputFieldEventHandlers: Record<string, InputFieldEventHandler> = {};
	public outputFieldEventHandlers: Record<string, OutputFieldEventHandler> = {};
	public formEventHandlers: Record<string, FormEventHandler> = {};
	public functions: Record<string, IFunctionRunner> = {};

	public createInputController(field: InputFieldMetadata): InputController<any> {
		const entry = this.inputs[field.Type];

		const ctor = entry != null && entry.controller != null
			? entry.controller
			: StringInputController;

		return new ctor(field);
	}

	public registerInputFieldControl(
		name: string,
		svelteComponent: any,
		controller: InputFieldControllerConstructor,
		constants: OutputControlConfiguration = null): void {
		this.inputs[name] = {
			controller,
			component: svelteComponent,
			constants: constants || new OutputControlConfiguration(false, false)
		};
	}

	public registerOutputFieldControl(svelteComponent: any, config: OutputControlConfiguration): void {
		if (config == null) {
			throw `Invalid attempt to register output control '${svelteComponent.name}' without a configuration.`;
		}

		this.outputs[config.type] = {
			component: svelteComponent,
			constants: config
		};
	}

	public registerFormEventHandler(name: string, handler: FormEventHandler): void {
		this.formEventHandlers[name] = handler;
	}

	public registerInputFieldEventHandler(name: string, handler: InputFieldEventHandler): void {
		this.inputFieldEventHandlers[name] = handler;
	}

	public registerOutputFieldEventHandler(name: string, handler: OutputFieldEventHandler): void {
		this.outputFieldEventHandlers[name] = handler;
	}

	public registerFunction(name: string, fn: IFunctionRunner): void {
		this.functions[name] = fn;
	}
}
