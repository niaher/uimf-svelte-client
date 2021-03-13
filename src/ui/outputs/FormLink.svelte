<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "formlink");
</script>

<script>
    import type {
        FormInstance,
        OutputController,
        UimfApp,
    } from "../../ts/framework";
    import { beforeUpdate } from "svelte";
    import Form from "../Form.svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    export let disabled: boolean;

    let url = "";
    let css = null;
    let working = false;

    beforeUpdate(() => {
        // `field.data.CssClass` takes precedence over metadata.
        css =
            field.data.CssClass != null
                ? field.data.CssClass
                : field.metadata?.getCustomProperty("CssClass");

        url = app.router.makeUrl(
            field.data.Form,
            field.data.InputFieldValues,
            false
        );
    });
</script>

{#if field.data.Action === "run"}
    <button
        type="button"
        class={css || "btn btn-secondary btn-sm"}
        class:working={working}
        disabled={disabled || working}
        on:click={async () => {
            working = true;
            await app.server.postForm(
                field.data.Form,
                field.data.InputFieldValues
            );

            form.submit(false);

            working = false;
        }}>{@html field.data.Label}</button>
{:else if field.data.Action === "open-modal"}
    <button
        type="button"
        class={css || "btn btn-secondary btn-sm"}
        {disabled}
        on:click={() => {
            var modalForm = app.getFormInstance(field.data.Form);
            modalForm.setInputFields(field.data.InputFieldValues);

            modalForm.on("form:responseHandled", (args) => {
                if (!args.postOnLoad) {
                    app.closeModal();
                    form.submit(false);
                }

                return Promise.resolve();
            });

            app.showModal(Form, {
                app: app,
                form: modalForm,
                useUrl: false,
                showCancelButton: true,
            });
        }}>{@html field.data.Label}</button
    >
{:else}
    <a href={url} class={css}>{@html field.data.Label}</a>
{/if}

<style>
    :global(.working) {
        background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 1rem,
            rgba(204, 204, 204, 0.4) 1rem,
            rgba(204, 204, 204, 0.4) 2rem
        );
        background-size: 200% 200%;
        animation: barberpole 10s linear infinite;
    }

    @keyframes barberpole {
        100% {
            background-position: 100% 100%;
        }
    }
</style>
