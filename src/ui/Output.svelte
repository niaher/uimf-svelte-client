<!-- svelte-ignore a11y-label-has-associated-control -->
<script>
    import type {
        FormInstance,
        OutputController,
        UimfApp,
    } from "../ts/framework";
    import { tooltip } from "./components/Tooltip.svelte";

    export let app: UimfApp;
    export let form: FormInstance;
    export let field: OutputController;
    export let hideLabel: boolean;

    var control =
        app.controlRegister.outputs[field.metadata.Type] ||
        app.controlRegister.outputs["json"];

    hideLabel =
        hideLabel ||
        control.constants.alwaysHideLabel ||
        field.metadata.Label === null ||
        field.metadata.Label === "";

    let hideIfNull =
        field.metadata.getCustomProperty("hideIfNull") != null ||
        control.constants.hideIfNull;

    let contentCssClass = control.constants.displayAsBlock ? "block" : "inline";

    let documentation = field.metadata.getCustomProperty("Documentation");
</script>

<style>
    .block {
        display: block;
    }

    .inline {
        display: inline;
    }
</style>

{#if field.data != null || !hideIfNull}
    {#if hideLabel}
        <div class={contentCssClass}>
            <svelte:component this={control.component} {field} {form} {app} />
        </div>
    {:else}
        <label class="form-label" use:tooltip={documentation}>{field.metadata.Label}:</label>
        <div class={contentCssClass}>
            <svelte:component this={control.component} {field} {form} {app} />
        </div>
    {/if}
{/if}
