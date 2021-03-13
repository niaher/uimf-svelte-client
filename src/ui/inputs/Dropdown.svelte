<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(false, false, false, "dropdown");

    class DropdownValue {
        public Value: string;
    }

    export class Controller extends InputController<DropdownValue> {
        public valueAsString: string = null;

        public getValue(): Promise<DropdownValue> {
            var innerValue = (this.value || {}).Value;
            var result =
                innerValue != null && innerValue !== "" ? this.value : null;

            return Promise.resolve(result);
        }

        public deserialize(value: string): Promise<DropdownValue> {
            var result =
                value == null || value === "" ? null : { Value: value };
            return Promise.resolve(result);
        }

        public serialize(value: DropdownValue): string {
            return value != null && value.Value != null && value.Value !== ""
                ? value.Value
                : null;
        }

        protected setValueInternal(value: DropdownValue): Promise<void> {
            this.valueAsString = value != null ? value.Value : null;
            return Promise.resolve();
        }
    }
</script>

<script>
    import type { FormInstance, UimfApp } from "../../ts/framework";
    import { onMount } from "svelte";

    export let app: UimfApp;
    export let form: FormInstance;
    export let field: Controller;

    let id = form.metadata.Id + "-" + field.metadata.Id;
    let tabindex = 0;
    let options = [];

    onMount(async () => {
        const {
            Items: items,
            Source: source,
        } = field.metadata.CustomProperties;

        if (items != null) {
            options = items;
        } else if (typeof source === "string") {
            const parameters: any[] = field.metadata.getCustomProperty(
                "Parameters"
            );
            const filter = {};

            if (parameters != null && parameters.length > 0) {
                let promises = parameters.map((p) => {
                    return form.inputs[p]
                        .getValue()
                        .then((value) => (filter[p] = value));
                });

                await Promise.all(promises);
            }

            var response = await app.server.postForm(source, filter);

            options = response.Items;
        }
    });
</script>

<select
    {id}
    bind:value={field.valueAsString}
    on:blur={() => (field.value = { Value: field.valueAsString })}
    required={field.metadata.Required}
    {tabindex}
    class="form-select"
>
    <option value="" />
    {#each options as option}
        <option
            value={option.Value}
            selected={field.valueAsString === option.Value}
        >
            {option.Label}
        </option>
    {/each}
</select>
