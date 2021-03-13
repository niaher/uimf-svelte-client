<script context="module">
    import { StringInputController, OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(false, false, false, "text");
    export class Controller extends StringInputController {}
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
    type="text"
    {id}
    bind:value={field.value}
    required={field.metadata.Required}
    {tabindex}
    class="form-control"
/>