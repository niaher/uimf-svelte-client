<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(
        false,
        false,
        false,
        "number"
    );

    export class Controller extends InputController<number> {
        public deserialize(value: string): Promise<number> {
            var result;

            if (value == null || value === "") {
                result = this.metadata.Required ? 0 : null;
            } else {
                let parsed = parseFloat(value);

                if (isNaN(parsed)) {
                    result = this.metadata.Required ? 0 : null;
                } else {
                    result = parsed;
                }
            }

            return Promise.resolve(result);
        }

        public serialize(value: number): string {
            return value != null ? value.toString() : null;
        }

        public getValue(): Promise<number> {
            return Promise.resolve(this.value);
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

<input
    type="number"
    {id}
    bind:value={field.value}
    required={field.metadata.Required}
    {tabindex}
    class="form-control"
/>
