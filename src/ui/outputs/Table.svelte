<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, true, false, "table");
</script>

<script>
    import { FormInstance, OutputController, UimfApp } from "../../ts/framework";
    import { OutputFieldMetadata } from "../../ts/server";
    import { onMount } from "svelte";
    import Output from "../Output.svelte";
    import { tooltip } from "../components/Tooltip.svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let columns: OutputFieldMetadata[] = field.metadata.CustomProperties.Columns.filter(
        (t) => !t.Hidden
    ).sort((a, b) => a.OrderIndex - b.OrderIndex);

    let inputFieldValues: any;

    onMount(async () => {
        inputFieldValues = await form.getInputFields();
    });

    function getCellValue(row, column: OutputFieldMetadata): OutputController {
        return new OutputController(
            new OutputFieldMetadata(column),
            row[column.Id]
        );
    }

    function getCustomProperty(metadata, property: string) {
        return ((metadata || {}).CustomProperties || {})[property];
    }
</script>

{#if field.data.length === 0}
    <em>No data found.</em>
{:else}
    <table class="table table-striped table-bordered">
        <thead>
            <tr>
                {#each columns as column}
                    <th use:tooltip={getCustomProperty(column, "Documentation")}
                        >{column.Label}</th
                    >
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each field.data as row}
                <tr>
                    {#each columns as column}
                        <td class={getCustomProperty(column, "ColumnCssClass")}>
                            <Output
                                {app}
                                field={getCellValue(row, column)}
                                {form}
                                hideLabel={true}
                            />
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style>
    .min-width {
        width: 1px;
    }
</style>
