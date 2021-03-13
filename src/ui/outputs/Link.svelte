<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "link");
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

    let css = field.metadata?.getCustomProperty("CssClass");
</script>

<a href={field.data.Url} class={css}>{@html field.data.Anchor}</a>
