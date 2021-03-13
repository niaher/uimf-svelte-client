<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, true, false, "preformatted-text");
</script>

<script>
    import type { FormInstance, OutputController, UimfApp } from "../../ts/framework";
    
    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;
</script>

<pre>{field.data.Value}</pre>
