<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(false, false, false, "datetime");

    export class Controller extends InputController<Date> {
        public valueAsString: string;

        /**
         * Removes browser's automatic timezone adjustments, by converting the date into
         * the UTC timezone.
         * @param {Date} date the date to convert.
         * @param {boolean} endOfDay indicate whether to adjust the time to the end of day.
         */
        private static convertToUtc(date: Date, endOfDay?: boolean): Date {
            if (date == null) {
                return null;
            }

            var time = endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z";

            var serialized = Controller.serializeDate(date) + time;

            return new Date(serialized);
        }

        public getValue(): Promise<Date> {
            return this.deserialize(this.valueAsString).then(value => {
                var asUtc = Controller.convertToUtc(value);
                return Promise.resolve(asUtc);
            });
        }

        public deserialize(value: string): Promise<Date> {
            var result = value != null ? new Date(value) : null;

            return Promise.resolve(result);
        }

        protected setValueInternal(value: Date): Promise<void> {
            this.valueAsString = value != null ? Controller.serializeDate(value) : null;

            return Promise.resolve();
        }

        private static serializeDate(value: Date): string {
            return (
                value.getFullYear() +
                "-" +
                (value.getMonth() + 1).toString().padStart(2, "0") +
                "-" +
                value.getDate().toString().padStart(2, "0")
            );
        }

        public serialize(value: Date | string): string {
            var date =
                value != null && typeof value === "string"
                    ? new Date(value)
                    : value;

            if (date == null) {
                return null;
            }

            return Controller.serializeDate(date);
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
    type="date"
    {id}
    bind:value={field.valueAsString}
    required={field.metadata.Required}
    {tabindex}
    class="form-control"
/>
