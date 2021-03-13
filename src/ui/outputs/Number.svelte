<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "number");
</script>

<script>
    import type { FormInstance, OutputController, UimfApp } from "../../ts/framework";
    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;
</script>

{#if field.data != null}{field.data}{/if}
