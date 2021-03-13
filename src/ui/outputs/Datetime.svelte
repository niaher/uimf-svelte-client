<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "datetime");
</script>

<script>
    import type {
        FormInstance,
        OutputController,
        UimfApp,
    } from "../../ts/framework";
    import { beforeUpdate } from "svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    let valueAsString = "";

    beforeUpdate(() => {
        valueAsString =
            field.data != null
                ? new Date(field.data).toLocaleDateString("en-GB", options)
                : null;
    });
</script>

<style>
    span {
        white-space: nowrap;
    }
</style>

<span>{valueAsString}</span>
