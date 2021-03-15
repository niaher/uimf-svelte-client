<script context="module">
    import {
        InputController,
        OutputControlConfiguration,
    } from "uimf-svelte-client";
    import { Controller as DateInputController } from "./Date.svelte";

    export const config = new OutputControlConfiguration(
        false,
        false,
        false,
        "date-range"
    );

    export class Controller extends InputController<DateRange> {
        public minAsString: string;
        public maxAsString: string;

        public getValue(): Promise<DateRange> {
            var result = new DateRange(this.minAsString, this.maxAsString);

            if (result.Min == null && result.Max == null) {
                result = null;
            } else {
                result.Min = DateInputController.convertToUtc(result.Min);
                result.Max = DateInputController.convertToUtc(result.Max);
            }

            return Promise.resolve(result);
        }

        public deserialize(value: string): Promise<DateRange> {
            var result = DateRange.parse(value);

            if (result.Min == null && result.Max == null) {
                result = null;
            }

            return Promise.resolve(result);
        }

        public serialize(value: DateRange): string {
            return DateRange.serialize(value);
        }

        protected setValueInternal(value: DateRange): Promise<void> {
            this.minAsString =
                value?.Min != null
                    ? DateInputController.serializeDate(value.Min)
                    : null;
            this.maxAsString =
                value?.Max != null
                    ? DateInputController.serializeDate(value.Max)
                    : null;

            return Promise.resolve();
        }
    }

    class DateRange {
        private static readonly nullValue: string = "null";
        private static readonly separator: string = "|";

        constructor(min?: Date | string, max?: Date | string) {
            this.Min = DateRange.getDate(min);
            this.Max = DateRange.getDate(max);
        }

        private static getDate(value: Date | string): Date {
            if (value == null || value === "") {
                return null;
            }

            if (typeof value === "string") {
                return new Date(value);
            }

            return value;
        }

        public static serialize(value: DateRange) {
            if (value == null) {
                return null;
            }

            if (value.Min == null && value.Max == null) {
                return null;
            }

            var min =
                value.Min != null
                    ? DateInputController.serializeDate(value.Min)
                    : DateRange.nullValue;
            var max =
                value.Max != null
                    ? DateInputController.serializeDate(value.Max)
                    : DateRange.nullValue;

            return `${min}${DateRange.separator}${max}`;
        }

        public static parse(value: string): DateRange {
            if (value == null || value == "") {
                return new DateRange(null, null);
            }

            var parsedValue;

            if (typeof value === "string") {
                var parts = value.split(DateRange.separator);

                parsedValue = {
                    min:
                        parts[0] === DateRange.nullValue || parts[0] == null
                            ? null
                            : new Date(parts[0]),
                    max:
                        parts[1] === DateRange.nullValue || parts[1] == null
                            ? null
                            : new Date(parts[1]),
                };
            } else {
                parsedValue = value;
            }

            return new DateRange(parsedValue.min, parsedValue.max);
        }

        public Min: Date = null;
        public Max: Date = null;
    }
</script>

<script>
    import type { FormInstance, UimfApp } from "../../ts/framework";

    export let app: UimfApp;
    export let form: FormInstance;
    export let field: Controller;
</script>

<div class="wrapper">
    <input
        type="date"
        bind:value={field.minAsString}
        required={field.metadata.Required}
        class="form-control min"
    />

    <input
        type="date"
        bind:value={field.maxAsString}
        required={field.metadata.Required}
        class="form-control max"
    />
</div>

<style>
    .wrapper {
        display: block;
        width: 100%;
    }

    .min {
        float: left;
        width: 49%;
    }

    .max {
        float: right;
        width: 49%;
    }
</style>
