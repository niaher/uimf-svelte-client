<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(
        false,
        false,
        false,
        "password"
    );

    export class Controller extends InputController<PasswordValue> {
        public selected: string;

        public deserialize(value: string): Promise<PasswordValue> {
            var result = value == null || value === "" ? null : { value };
            return Promise.resolve(result);
        }

        public serialize(value: PasswordValue): string {
            return value != null ? value.value : null;
        }

        public getValue(): Promise<PasswordValue> {
            return this.deserialize(this.selected);
        }

        protected setValueInternal(value: PasswordValue): Promise<void> {
            this.selected = this.serialize(value);
            return Promise.resolve();
        }
    }

    class PasswordValue {
        public value: string;
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
    type="password"
    {id}
    bind:value={field.selected}
    required={field.metadata.Required}
    {tabindex}
    class="form-control"
/>
