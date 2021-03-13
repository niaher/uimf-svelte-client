<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(true, true, true, "action-list");
</script>

<script>
    import { FormInstance, OutputController, UimfApp } from "../../ts/framework";
    import { OutputFieldMetadata } from "../../ts/server";
    import FormLink from "./FormLink.svelte";
    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let formLinkMetadata = new OutputFieldMetadata({
        CustomProperties: {
            CssClass: "btn btn-sm btn-secondary",
        },
    });
</script>

{#if field.data != null && field.data.Actions != null && field.data.Actions.length > 0}
    <div class="action-list">
        {#each field.data.Actions as action}
            <!-- svelte-ignore missing-declaration -->
            <div class="action">
                <FormLink
                    {app}
                    field={new OutputController(formLinkMetadata, action)}
                    {form}
                />
            </div>
        {/each}
    </div>
{/if}

<style>
    .action-list {
        white-space: nowrap;
        text-align: right;
    }

    .action-list > .action {
        display: inline-block;
        margin-right: 5px;
    }

    .action-list > .action:last-child {
        margin-right: 0;
    }
</style>
