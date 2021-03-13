<script>
	import type { ControlRegister } from "../../ts/framework";
	import * as inputEventHandlers from "../../ts/eventHandlers/input";
	import * as functions from "../../ts/functions/index.js";
	import * as inputs from "../inputs/index.js";
	import * as outputs from "../outputs";
	
	export let controlRegister: ControlRegister;

	function registerInput(component) {
		controlRegister.registerInputFieldControl(
			component.config.type, 
			component.default, 
			component.Controller, 
			component.config);	
	}

	function registerOutput(component) {
		controlRegister.registerOutputFieldControl(component.default, component.config);
	}

	// Inputs.
	registerInput(inputs.Boolean);
	registerInput(inputs.Date);
	registerInput(inputs.Dropdown);
	registerInput(inputs.Email);
	registerInput(inputs.FileUpload);
	registerInput(inputs.Multiselect);
	registerInput(inputs.Number);
	registerInput(inputs.Paginator);
	registerInput(inputs.Password);
	registerInput(inputs.Text);
	registerInput(inputs.Textarea);
	registerInput(inputs.Typeahead);

	// Outputs.
	registerOutput(outputs.ActionList);
	registerOutput(outputs.Datetime);
	registerOutput(outputs.FileSize);
	registerOutput(outputs.FormLink);
	registerOutput(outputs.HtmlString);
	registerOutput(outputs.Image);
	registerOutput(outputs.InlineForm);
	registerOutput(outputs.Json);
	registerOutput(outputs.Link);
	registerOutput(outputs.List);
	registerOutput(outputs.Number);
	registerOutput(outputs.PaginatedData);
	registerOutput(outputs.PreformattedText);
	registerOutput(outputs.Table);
	registerOutput(outputs.Tabstrip);
	registerOutput(outputs.Tag);
	registerOutput(outputs.Text);

	// Event handlers.
	controlRegister.registerInputFieldEventHandler("bind-to-output", new inputEventHandlers.BindToOutput());

	// Functions.
	controlRegister.registerFunction("toast", new functions.Toast());
</script>
