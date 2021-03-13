<script context="module">
	import { InputController, OutputControlConfiguration } from "../../ts/framework";

	export const config = new OutputControlConfiguration(false, false, false, "boolean");

	export class Controller extends InputController<boolean> {
		public deserialize(value: string): Promise<boolean> {
			var result =
				value != null && value !== ""
					? value === "true"
					: this.metadata.Required
					? false
					: null;

			return Promise.resolve(result);
		}

		public serialize(value: boolean): string {
			return value != null ? value.toString() : null;
		}

		public getValue(): Promise<boolean> {
			var result = this.metadata.Required ? !!this.value : this.value;

			return Promise.resolve(result);
		}
	}
</script>

<script>
	import type { FormInstance, UimfApp }from "../../ts/framework";

	export let app: UimfApp;
	export let form: FormInstance;
	export let field: Controller;

	let id = form.metadata.Id + "-" + field.metadata.Id;
	let tabindex = 0;
</script>

{#if field.metadata.Required}
	<input
		type="checkbox"
		{id}
		class="checkbox form-control"
		bind:checked={field.value}
		{tabindex}
	/>
{:else}
	<select bind:value={field.value} {id} class="form-control">
		<option />
		<option value={true}>Yes</option>
		<option value={false}>No</option>
	</select>
{/if}

<style>
	.checkbox {
		height: 20px;
		width: 20px;
		margin: 0.6rem 0.5rem 1.1rem 0.5rem;
		overflow: initial;
		position: relative;
		clip: initial;
		clip-path: initial;
		top: 3px;
	}
</style>
