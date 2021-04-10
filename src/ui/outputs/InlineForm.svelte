<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(true, true, false, "inline-form");
</script>

<script>
    import type {
        FormInstance,
        OutputController,
        UimfApp,
    } from "../../ts/framework";
    import { onMount } from "svelte";
    import Form from "../Form.svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let inlineForm = app.getFormInstance(field.data.Form);
    inlineForm.parentForm = form;
    
    let inputsSet = false;

    onMount(async () => {
        if (inlineForm != null) {
            await inlineForm.setInputFields(field.data.InputFieldValues);
            inputsSet = true;
        }
    });
</script>

{#if inlineForm != null && inputsSet}
    <div>
        <Form {app} form={inlineForm} useUrl={false} showTitle={false} />
    </div>
{/if}
