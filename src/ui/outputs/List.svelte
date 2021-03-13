<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "list");
</script>

<script>
    import { FormInstance, OutputController, UimfApp } from "../../ts/framework";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    var control =
        app.controlRegister.outputs[field.metadata.getCustomProperty("Type")] ||
        app.controlRegister.outputs["json"];

    let cssClass =
        field.metadata.getCustomProperty("CssClass") || "list-unstyled";
</script>

{#if field.data != null}
    <ul class="{cssClass} list">
        {#each field.data as item}
            <li>
                <svelte:component
                    this={control.component}
                    field={new OutputController(null, item)}
                    {form}
                    {app}
                />
            </li>
        {/each}
    </ul>
{/if}

<style>
    .list {
        margin-bottom: 0;
    }

    .list > li > :global(p):last-child {
        margin-bottom: 0;
    }
</style>
