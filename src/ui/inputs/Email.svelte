<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(
        false,
        false,
        false,
        "email"
    );

    export class Controller extends InputController<EmailValue> {
        public valueAsString: string;

        public getValue(): Promise<EmailValue> {
            return this.deserialize(this.valueAsString);
        }

        public deserialize(value: string): Promise<EmailValue> {
            var result =
                value == null || value === "" ? null : EmailValue.parse(value);
            return Promise.resolve(result);
        }

        public serialize(value: EmailValue): string {
            return value != null ? value.Value : null;
        }

        protected setValueInternal(value: EmailValue): Promise<void> {
            this.valueAsString = this.serialize(value);
            return Promise.resolve();
        }
    }
    
    class EmailValue {
        constructor(value: string = null) {
            this.Value = value;
        }
        public static parse(value: string): EmailValue {
            return new EmailValue(value);
        }
        public Value: string;
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
    type="email"
    {id}
    bind:value={field.valueAsString}
    required={field.metadata.Required}
    {tabindex}
    class="form-control"
/>
