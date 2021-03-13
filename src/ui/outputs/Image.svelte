<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "image");
</script>

<script>
    import type {
        FormInstance,
        OutputController,
        UimfApp,
    } from "../../ts/framework";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let css = field.metadata.getCustomProperty("CssClass");
</script>

{#if field.data != null}
    <img src={field.data.Url} alt={field.data.AltText} class={css} />
{/if}

<style>
    .img-thumbnail {
        width: 150px;
        max-width: 150px;
    }
</style>
