<script>
    import type { FormInstance, UimfApp } from "../ts/framework";
    import type { FormResponse } from "../ts/server";
    import { onDestroy, onMount } from "svelte";
    import Input from "./Input.svelte";
    import Output from "./Output.svelte";

    export let app: UimfApp;
    export let form: FormInstance;
    export let useUrl: boolean = true;
    export let showCancelButton: boolean = false;
    export let showTitle: boolean = true;

    let visibleInputs = form.metadata.InputFields.filter(
        (t) => t.Hidden === false
    )
        .sort((a, b) => a.OrderIndex - b.OrderIndex)
        .map((t) => form.inputs[t.Id]);

    let visibleOutputs = form.metadata.OutputFields.filter(
        (t) => t.Hidden === false
    )
        .sort((a, b) => a.OrderIndex - b.OrderIndex)
        .map((t) => form.outputs[t.Id]);

    let disabled = false;
    let response: FormResponse = null;
    let currentUrlParams = null;
    let onDestroyCallbacks = [];
    let title = form.metadata.Label;
    let cssClass = form.metadata.getCustomProperty("CssClass") || "";
    let documentation = form.metadata.getCustomProperty("Documentation");

    updatePageTitle();

    var unsubscribeResponseHandler = form.on(
        "form:responseHandled",
        async function () {
            // Force re-rendering of inputs. This is needed in case any of the input
            // field values have been changed (e.g. - as a result `bind-to-output`).
            visibleInputs = visibleInputs;

            // Force rerendering of response.
            visibleOutputs = visibleOutputs;

            // Don't attempt to change url if the url in the browser is pointing to a different form.
            // This can happen if `form.submit` resulted in a `ReloadResponseHandler` (or another similar
            // handler) redirecting user to a different form.
            if (useUrl && form.metadata.Id == app.router.getCurrentFormId()) {
                updatePageTitle();

                const urlParams = await form.getUrlParams();
                urlParams._ = app.router.getUrlParams()._;

                // Indicate which URL is currently loaded.
                currentUrlParams = urlParams;

                // Update url in the browser.
                app.router.setFormUrlParams(urlParams);
            }
        }
    );

    onDestroyCallbacks.push(unsubscribeResponseHandler);

    function stringifyUrlParams(params: Record<string, string>) {
        if (params == null) {
            return null;
        }

        return Object.keys(params)
            .sort()
            .map((t) => `${t}=${params[t]}`)
            .join("&");
    }

    onMount(async () => {
        function listenToLocationChange() {
            var unsubscribe = app.router.on(
                "stateChangeEnd",
                async function () {
                    var newFormId = app.router.getCurrentFormId();
                    var newUrlParams = app.router.getUrlParams();

                    if (
                        form.metadata.Id == newFormId &&
                        stringifyUrlParams(currentUrlParams) !==
                            stringifyUrlParams(newUrlParams)
                    ) {
                        await setInputFieldsFromUrl();
                        await submit(null, false);
                    }
                }
            );

            onDestroyCallbacks.push(() => unsubscribe());
        }

        if (useUrl) {
            await setInputFieldsFromUrl();

            if (form.metadata.PostOnLoad) {
                await submit(null, true);
            }

            listenToLocationChange();
        } else {
            if (form.metadata.PostOnLoad) {
                await submit(null, true);
            }
        }
    });

    onDestroy(() => {
        onDestroyCallbacks.forEach((c) => c());
    });

    function updatePageTitle() {
        let responseTitle = ((form.response || {}).Metadata || {}).Title;

        title = responseTitle || form.metadata.Label || form.metadata.Id;

        if (useUrl === true) {
            document.title = title;
        }
    }

    async function setInputFieldsFromUrl() {
        var newParams = app.router.getUrlParams();
        await form.setInputFields(newParams);

        // Force rerendering of inputs.
        visibleInputs = visibleInputs;
    }

    async function submit(event: Event, asPostOnLoad: boolean) {
        if (event != null) {
            event.preventDefault();
        }

        // Disable double-posts.
        disabled = true;

        try {
            response = await form.submit(asPostOnLoad);
        } catch (e) {
            if (e === "validation") {
                // Form is not valid and therefore can't be submitted. Do nothing and let user enter correct values.
            } else {
                if (e.error != null) {
                    alert(e.error);
                } else {
                    console.error(e);
                }
            }
        } finally {
            disabled = false;
        }
    }
</script>

<div class="{cssClass} horizontal">
    {#if showTitle}
        <h1>{title}</h1>
    {/if}

    {#if documentation != null}
        <div class="card my-3 bg-light">
            <div class="card-body">{@html documentation.Content}</div>
        </div>
    {/if}

    {#if visibleInputs.length > 0}
        <form on:submit={async (e) => await submit(e, false)} class="row">
            {#each visibleInputs as field}
                <div class="col-12 input">
                    <Input {app} {field} {form} />
                </div>
            {/each}

            <div class="col-12 text-end">
                {#if showCancelButton === true}
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click={() => app.closeModal()}>Cancel</button
                    >
                {/if}

                <button
                    type="submit"
                    class="btn btn-primary"
                    {disabled}
                    class:working={disabled}
                >
                    {@html form.metadata.CustomProperties.SubmitButtonLabel ||
                        "Submit"}
                </button>
            </div>
        </form>
    {/if}

    {#if response != null}
        <div class="outputs">
            {#each visibleOutputs as field}
                <div>
                    <Output {app} {field} {form} />
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .outputs {
        margin: 20px 0;
    }

    .outputs > div {
        margin-bottom: 10px;
    }

    .outputs > div:last-child {
        margin-bottom: 0;
    }

    form > div {
        margin-bottom: 10px;
    }

    form > div.input > :global(label) {
        margin-top: 4px;
    }

    .horizontal > form > div.input {
        display: flex;
        flex-direction: row;

        & > :global(label) {
            width: 150px;
        }
    }

    .card-body > :global(p:last-child) {
        margin-bottom: 0;
    }
</style>
