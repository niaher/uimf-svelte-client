<!-- svelte-ignore a11y-label-has-associated-control -->
<script>
    import type { FormInstance, InputController, UimfApp } from "../ts/framework";
    import { tooltip } from "./components/Tooltip.svelte";

    export let app: UimfApp;
    export let form: FormInstance;
    export let field: InputController<any>;

    var control =
        app.controlRegister.inputs[field.metadata.Type] ||
        app.controlRegister.inputs["text"];

    var hideLabel =
        control.constants.alwaysHideLabel ||
        field.metadata.Label === null ||
        field.metadata.Label === "";

    var documentation = field.metadata.getCustomProperty("Documentation");

    field.on("changed", () => {
        field.value = field.value;
    });
</script>

{#if !hideLabel}
    <label class="form-label" use:tooltip={documentation}
        >{field.metadata.Label}:</label
    >
{/if}

<svelte:component this={control.component} {field} {form} {app} />
