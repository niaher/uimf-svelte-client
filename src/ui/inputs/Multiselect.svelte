<script context="module">
	import { InputController, OutputControlConfiguration } from "../../ts/framework";

	export const config = new OutputControlConfiguration(
		false,
		false,
		false,
		"multiselect"
	);

	class MultiselectValue {
		constructor(value?: any[]) {
			this.Items = value;
		}

		public Items: any[];
	}

	export class Controller extends InputController<MultiselectValue> {
		public static delimitter = "|";

		public deserialize(value: string): Promise<MultiselectValue> {
			var result =
				value == null || value === ""
					? null
					: new MultiselectValue(value.split(Controller.delimitter));

			return Promise.resolve(result);
		}

		public serialize(value: MultiselectValue): string {
			return value != null && value.Items.length > 0
				? value.Items.join(Controller.delimitter)
				: null;
		}

		public getValue(): Promise<MultiselectValue> {
			var result =
				this.value != null && this.value.Items.length > 0
					? this.value
					: null;

			return Promise.resolve(result);
		}

		protected setValueInternal(value: MultiselectValue): Promise<void> {
			if (value == null || value.Items.length === 0) {
				this.value = null;
			}

			return Promise.resolve();
		}
	}
</script>

<script>
	import type { FormInstance, UimfApp }from "../../ts/framework";
	import { beforeUpdate } from "svelte";
	import Select from "svelte-select";

	export let app: UimfApp;
	export let form: FormInstance;
	export let field: Controller;

	let id = form.metadata.Id + "-" + field.metadata.Id;
	let tabindex = 0;

	let items =
		field.metadata.getCustomProperty("Source").map((t) => {
			return { label: t.Label, value: t.Value };
		}) || [];

	let selected = [];

	async function handleSelect(event) {
		field.value =
			event.detail != null
				? { Items: event.detail.map((t) => t.value) }
				: null;
	}

	beforeUpdate(() => {
		selected =
			field.value != null && field.value.Items.length > 0
				? field.value.Items.map((t) => items.find((c) => c.value == t))
				: [];
	});
</script>

<div class="wrapper">
	<Select
		{items}
		inputAttributes={{ id: id, tabindex: tabindex }}
		selectedValue={selected}
		on:select={handleSelect}
		isMulti={true}
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
