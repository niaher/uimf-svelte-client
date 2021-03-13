<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(
        false,
        false,
        false,
        "textarea"
    );

    class TextareaValue {
        public Value: string;
    }

    export class Controller extends InputController<TextareaValue> {
        public selected: string;

        public deserialize(value: string): Promise<TextareaValue> {
            var result =
                value == null || value === "" ? null : { Value: value };
            return Promise.resolve(result);
        }

        public serialize(value: TextareaValue): string {
            return value != null ? value.Value : null;
        }

        public getValue(): Promise<TextareaValue> {
            return this.deserialize(this.selected);
        }

        protected setValueInternal(value: TextareaValue): Promise<void> {
            this.selected = this.serialize(value);
            return Promise.resolve();
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

<textarea
    {id}
    bind:value={field.selected}
    required={field.metadata.Required}
    {tabindex}
    class="form-control"
/>
