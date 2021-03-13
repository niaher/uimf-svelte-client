<script context="module">
	import { InputController, OutputControlConfiguration } from "../../ts/framework";

	export const config = new OutputControlConfiguration(false, false, false, "typeahead");

	export class Controller extends InputController<TypeaheadValue> {
		public deserialize(value: string): Promise<TypeaheadValue> {
			var result =
				value == null || value === ""
					? null
					: new TypeaheadValue(value);

			return Promise.resolve(result);
		}

		public serialize(value: TypeaheadValue): string {
			return value != null && value.Value != null ? value.Value : null;
		}

		public getValue(): Promise<TypeaheadValue> {
			var result =
				this.value != null && this.value.Value != null
					? this.value
					: null;

			return Promise.resolve(result);
		}

		protected setValueInternal(value: TypeaheadValue): Promise<void> {
			return Promise.resolve();
		}
	}

	// tslint:disable-next-line:max-classes-per-file
	class TypeaheadValue {
		constructor(value?: any) {
			this.Value = value;
		}

		public Value: any;
	}
</script>

<script>
	import type { FormInstance, UimfApp }from "../../ts/framework";
	import Select from "svelte-select";

	export let app: UimfApp;
	export let form: FormInstance;
	export let field: Controller;

	let id = form.metadata.Id + "-" + field.metadata.Id;
	let tabindex = 0;
	const { Items: items, Source: source } = field.metadata.CustomProperties;

	let cachedOptions: Record<string, Promise<any>> = {};

	async function loadOptions(query): Promise<any> {
		if (items != null && items.length > 0) {
			return Promise.resolve(items);
		}

		let cacheKey =
			typeof query === "object" && query != null ? query.Value : query;

		if (cachedOptions[cacheKey] != null) {
			return cachedOptions[cacheKey];
		}

		var postData =
			typeof query === "object" && query != null
				? { Ids: { Items: [query.Value] } }
				: { Query: query };

		const parameters: any[] = field.metadata.getCustomProperty(
			"Parameters"
		);

		if (parameters != null) {
			let promises = parameters.map((p) => {
				switch (p.SourceType) {
					case "response":
						postData[p.Parameter] = form.response[p.Source].value;
						return Promise.resolve();
					case "request":
						return form.inputs[p.Source]
							.getValue()
							.then((value) => (postData[p.Parameter] = value));
				}
			});

			await Promise.all(promises);
		}

		var response = (cachedOptions[cacheKey] = app.server
			.postForm(source, postData)
			.then((t) => {
				return t.Items;
			}));

		return await response;
	}

	field.on("changed", async () => {
		if (field.serialize(field.value) != null) {
			let results = await loadOptions(field.value);
			field.value =
				results != null && results.length > 0
					? results.find((t) => t.Value == field.value.Value)
					: null;

			if (field.value == null) {
				throw `Cannot find option for "${field.metadata.Id}" with value "${field.value.Value}".`;
			}
		} else {
			field.value = null;
		}
	});
</script>

<div class="wrapper">
	<Select
		inputAttributes={{ id: id, tabindex: tabindex }}
		selectedValue={field.value}
		getSelectionLabel={(t) => t.Label}
		getOptionLabel={(t) => t.Label}
		optionIdentifier="Value"
		on:select={(e) => (field.value = e.detail)}
		on:clear={() => (field.value = null)}
		{loadOptions}
	/>
</div>

<style>
	.wrapper {
		width: 100%;
	}

	.wrapper > :global(.selectContainer) {
		width: 100%;
	}
</style>
