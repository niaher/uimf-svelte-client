<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(true, true, true, "tabstrip");
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
</script>

<style>
    .nav-item {
        margin-right: 5px;
    }
</style>

<ul class="nav nav-tabs">
    {#each field.data.Tabs as tab}
        <li class="nav-item">
            <a
                href={app.router.makeUrl(tab.Form, tab.InputFieldValues, true)}
                class="nav-link"
                class:active={tab.Form === field.data.CurrentTab}>{tab.Label}</a
            >
        </li>
    {/each}
</ul>
