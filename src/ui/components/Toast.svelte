<script>
    import type { Writable } from "svelte/store";
    import { slide } from "svelte/transition";
    import { quintOut } from 'svelte/easing';

    export let toasts: Writable<any[]>;

    function close(toast) {
        toasts.update((v) => v.filter((c) => c !== toast));
    }
</script>

<div class="toast-container position-absolute p-3 top-0 end-0">
    {#each $toasts as toast}
        <div
            transition:slide={{ delay: 250, duration: 300, easing: quintOut }}
            class="toast show {toast.style}"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            {#if toast.heading != null}
                <div class="toast-header">
                    <strong class="me-auto">{toast.heading}</strong>
                    <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        on:click={() => close(toast)}
                    />
                </div>
                <div class="toast-body">{toast.message}</div>
            {:else}
                <div class="d-flex">
                    <div class="toast-body">
                        {toast.message}
                    </div>
                    <button
                        type="button"
                        class="btn-close me-2 m-auto"
                        aria-label="Close"
                        on:click={() => close(toast)}
                    />
                </div>
            {/if}
        </div>
    {/each}
</div>
