<script>
    import { MenuItem, OutputController, UimfApp } from "../../ts/framework";
    import FormLink from "../outputs/FormLink.svelte";
    
    export let app: UimfApp;
    export let menu: MenuItem;
</script>

{#if menu != null}
    <ul class="menu">
        {#each menu.Children as item}
            <li>
                {#if item.Form != null}
                <FormLink field={new OutputController(null, item)} {app} form={null} />
                {:else if item.Children.length > 0}
                <span>{item.Label}</span>
                <svelte:self {app} menu={item} />
                {/if}
            </li>
        {/each}
    </ul>
{/if}
