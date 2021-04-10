<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    import { FormLink as FormLinkMetadata } from "../../ts/server/FormLink";

    export const config = new OutputControlConfiguration(false, true, false, "paginated-data");

    class Row {
        constructor (data:any) {
            this.data = data;
        }

        data:any = null;
        selected:boolean = false;
    }

    class Page {
        constructor(form:FormInstance, inputFieldValues:any, index:number){
            this.form = form;
            this.index = index;
            this.inputFieldValues = inputFieldValues;
        }

        public index:number;
        public inputFieldValues:any;
        private form:FormInstance;
        
        url(app:UimfApp):string {
            return app.router.makeUrl(this.form.metadata.Id, this.inputFieldValues, true);
        }

        async go() {
            await this.form.setInputFields(this.inputFieldValues);
            await this.form.submit(true);
        }
    }

    class BulkAction extends FormLinkMetadata {
        public refreshLabel() {
            let selectedCount = this.InputFieldValues.ItemIds.Items.length;

            if (selectedCount > 0) {
                this.Label = `${this._originalLabel} (${selectedCount})`;
            } else {
                this.disabled = true;
            }
        }

        public addItem(itemId:any) {
            this.InputFieldValues.ItemIds.Items.push(itemId);
        }

        public static createFrom(action:BulkAction):BulkAction {
            var bulkAction:BulkAction = new BulkAction();
            Object.assign(bulkAction, JSON.parse(JSON.stringify(action)));

            bulkAction._originalLabel = bulkAction.Label;
            bulkAction.InputFieldValues.ItemIds.Items = [];

            return bulkAction;
        }

        private _originalLabel: string;
        public disabled: boolean;
        public ItemId: any;
    }
</script>

<script>
    import { FormInstance, OutputController, UimfApp } from "../../ts/framework";
    import { OutputFieldMetadata } from "../../ts/server";
    import { onMount } from "svelte";
    import { PaginationParameters } from "../inputs/Paginator.svelte";
    import Output from "../Output.svelte";
    import { tooltip } from "../components/Tooltip.svelte";
    import FormLink from "./FormLink.svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let columns: OutputFieldMetadata[] = field.metadata.CustomProperties.Columns.sort((a, b) => a.OrderIndex - b.OrderIndex);
    let paginatorId = field.metadata.CustomProperties.Customizations.Paginator;
    let paginatorValue: PaginationParameters;
    let pageCount: number;
    let inputFieldValues: any;
    let pages:Page[] = [];
    let pageSizes = [10, 20, 50];
    let bulkActionsProperty = field.metadata.getCustomProperty("BulkActionsProperty");
    let bulkActions: BulkAction[] = [];
    let allRowsSelected = false;
    let rows:Row[] = getRows();

    field.on("changed", async function () {
        allRowsSelected = false;
        rows = getRows();
        await init();
    });

    onMount(async() => {
        await init();
    });

    async function init() {
        paginatorValue = form.inputs[paginatorId].value || new PaginationParameters();
        pageCount = Math.ceil(field.data.TotalCount / paginatorValue.PageSize);
        inputFieldValues = await form.getInputFields();
        pages = [];

        for (let i = 1; i <= pageCount; i++) {
            var formParams = getInputFieldValuesForPage(i);
            pages.push(new Page(form, formParams, i));
        }

        if (bulkActionsProperty != null) {
            bulkActions = getBulkActions(rows);
        }
    }

    function getRows() {
        return field.data.Results?.map(t => new Row(t));
    }

    function getCellValue(row:Row, column: OutputFieldMetadata): OutputController {
        return new OutputController(
            new OutputFieldMetadata(column),
            row.data[column.Id]
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

    function getBulkActions(rows:Row[]) {
        var actions:BulkAction[] = [];

        for (let row of rows) {
            let rowActions:BulkAction[] = (row.data[bulkActionsProperty] || {}).Actions || [];

            // Bulk actions will have `ItemId` property.
            rowActions = rowActions.filter((t) => t.ItemId != null);

            for (let action of rowActions) {
                let bulkAction = actions.find((t) => t.Form === action.Form);

                if (bulkAction == null) {
                    bulkAction = BulkAction.createFrom(action);
                    actions.push(bulkAction);
                }

                if (row.selected) {
                    bulkAction.addItem(action.ItemId);
                }
            }
        }

        for (let action of actions) {
            action.refreshLabel();
        }

        return actions;
    }

    function selectAllRows(selected: boolean) {
        rows.forEach((row) => {
            row.selected = selected;
        });

        updateBulkActions();
    }

    function updateBulkActions() {
        bulkActions = getBulkActions(rows);
        rows = rows;
    }
</script>

{#if field.data.Results.length === 0}
    <em>No data found.</em>
{:else}
    {#if bulkActions.length > 0}
    <div class="btn-bar">
        {#each bulkActions as action}
            <FormLink {form} {app} field={new OutputController(null, action)} disabled={action.disabled} />
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
                    <th use:tooltip={getCustomProperty(column, "Documentation")}>{column.Label}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each rows as row}
                <tr>
                    {#if bulkActions.length > 0}
                        <td>
                            <input
                                type="checkbox"
                                bind:checked={row.selected}
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
                        getInputFieldValuesForPage(1),
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
                        {#if form.parentForm != null}
                            <button class="page-link" on:click={()=> page.go()}>{page.index}</button>
                        {:else}
                            <a class="page-link" href={page.url(app)}>{page.index}</a>
                        {/if}
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
