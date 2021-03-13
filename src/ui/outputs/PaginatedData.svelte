<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, true, false, "paginated-data");
</script>

<script>
    import { FormInstance, OutputController, UimfApp } from "../../ts/framework";
    import { OutputFieldMetadata } from "../../ts/server";
    import { beforeUpdate, onMount, tick } from "svelte";
    import { PaginationParameters } from "../inputs/Paginator.svelte";
    import Output from "../Output.svelte";
    import { tooltip } from "../components/Tooltip.svelte";
    import FormLink from "./FormLink.svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let columns: OutputFieldMetadata[] = field.metadata.CustomProperties.Columns.sort(
        (a, b) => a.OrderIndex - b.OrderIndex
    );

    let paginatorId = field.metadata.CustomProperties.Customizations.Paginator;
    let paginatorValue: PaginationParameters;
    let pageCount: number;
    let inputFieldValues: any;
    let pages = [];
    let pageSizes = [10, 20, 50];
    let bulkActionsProperty = field.metadata.getCustomProperty(
        "BulkActionsProperty"
    );
    let bulkActions: OutputController[] = [];
    let rowSelectionChanged = true;
    let allRowsSelected = false;

    field.on("changed", function () {
        rowSelectionChanged = true;
        allRowsSelected = false;
    });

    onMount(async () => {
        inputFieldValues = await form.getInputFields();
    });

    beforeUpdate(() => {
        paginatorValue =
            form.inputs[paginatorId].value || new PaginationParameters();
        pageCount = Math.ceil(field.data.TotalCount / paginatorValue.PageSize);

        pages = [];
        for (let i = 1; i <= pageCount; i++) {
            var formParams = getInputFieldValuesForPage(i);

            pages.push({
                index: i,
                label: i.toString(),
                url: app.router.makeUrl(form.metadata.Id, formParams, true),
            });
        }

        if (bulkActionsProperty != null && rowSelectionChanged) {
            bulkActions = getBulkActions(field.data.Results);
            rowSelectionChanged = false;
        }
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

    function getInputFieldValuesForPage(pageIndex: number) {
        var paginationParams = { ...paginatorValue, PageIndex: pageIndex };

        return {
            ...inputFieldValues,
            [paginatorId]: paginationParams,
        };
    }

    function getBulkActions(rows) {
        var actions = [];

        for (let row of rows) {
            let rowActions = (row[bulkActionsProperty] || {}).Actions || [];

            // Bulk actions will have `ItemId` property.
            rowActions = rowActions.filter((t) => t.ItemId != null);

            for (let action of rowActions) {
                let bulkAction = actions.find((t) => t.Form === action.Form);

                if (bulkAction == null) {
                    bulkAction = JSON.parse(JSON.stringify(action));
                    bulkAction._originalLabel = bulkAction.Label;
                    bulkAction.InputFieldValues.ItemIds.Items = [];

                    actions.push(bulkAction);
                }

                if (row._selected) {
                    bulkAction.InputFieldValues.ItemIds.Items.push(
                        action.ItemId
                    );
                }
            }
        }

        for (let action of actions) {
            let selectedCount = action.InputFieldValues.ItemIds.Items.length;
            if (selectedCount > 0) {
                action.Label = `${action._originalLabel} (${selectedCount})`;
            } else {
                action._disabled = true;
            }
        }

        return actions.map((t) => new OutputController(null, t));
    }

    function selectAllRows(selected: boolean) {
        field.data.Results.forEach((row) => {
            row._selected = selected;
        });

        updateBulkActions();
    }

    function updateBulkActions() {
        rowSelectionChanged = true;
        field.data.Results = field.data.Results;
    }
</script>

{#if field.data.Results.length === 0}
    <em>No data found.</em>
{:else}
    {#if bulkActions.length > 0}
    <div class="btn-bar">
        {#each bulkActions as action}
            <FormLink {form} {app} field={action} disabled={action.data._disabled} />
        {/each}
    </div>
    {/if}
    <table class="table table-striped table-bordered">
        <thead>
            <tr>
                {#if bulkActions.length > 0}
                    <th class="min-width">
                        <input
                            type="checkbox"
                            bind:checked={allRowsSelected}
                            on:change={(e) => selectAllRows(allRowsSelected)}
                        />
                    </th>
                {/if}
                {#each columns as column}
                    <th use:tooltip={getCustomProperty(column, "Documentation")}
                        >{column.Label}</th
                    >
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each field.data.Results as row}
                <tr>
                    {#if bulkActions.length > 0}
                        <td>
                            <input
                                type="checkbox"
                                bind:checked={row._selected}
                                on:change={() => updateBulkActions()}
                            />
                        </td>
                    {/if}
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

    {#if pageCount > 1}
        <nav>
            <select
                class="form-select page-size"
                bind:value={paginatorValue.PageSize}
                on:blur={() =>
                    app.router.go(
                        form.metadata.Id,
                        getInputFieldValuesForPage(paginatorValue.PageIndex),
                        true
                    )}
            >
                {#each pageSizes as pageSize}
                    <option value={pageSize}>{pageSize}</option>
                {/each}
            </select>
            <ul class="pagination">
                {#each pages as page}
                    <li
                        class="page-item"
                        class:active={page.index == paginatorValue.PageIndex}
                    >
                        <a class="page-link" href={page.url}>{page.label}</a>
                    </li>
                {/each}
            </ul>
        </nav>
    {/if}
{/if}

<style>
    .page-size {
        float: left;
        display: inline-block;
        width: 80px;
        margin-right: 10px;
    }

    .min-width {
        width: 1px;
    }

    .btn-bar {
        text-align: right;
        padding: 5px 2px;
        background: #fbfbfb;
        border-radius: 2px 2px 0px 0px;
        border: 1px solid #dee2e6;
        border-bottom: 0;
    }

    .btn-bar > :global(button) {
        margin-right: 5px;
    }
</style>
