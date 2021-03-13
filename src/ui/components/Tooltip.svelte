<script context="module">
    import tippy from "sveltejs-tippy";

    export function tooltip(node: HTMLElement, documentation: any) {
        if (documentation != null) {
            node.classList.add("has-documentation");

            var content = typeof(documentation) === "string" ? documentation : documentation.Content;

            return tippy(node, {
                content: content,
                allowHTML: true,
            });
        }

        return function () {};
    }
</script>

<style>
    :global(label.has-documentation),
    :global(th.has-documentation) {
        text-decoration: underline dotted;
    }
</style>
