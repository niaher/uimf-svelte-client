<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";
    export const config = new OutputControlConfiguration(false, false, false, "tag");

    var cache = {
        compliment: {},
        color: {}
    };

    function hexToRgb(hex) {
        return hex
            .replace(
                new RegExp("^#?([a-f\d])([a-f\d])([a-f\d])$", "i"),
                (m, r, g, b) => "#" + r + r + g + g + b + b
            )
            .substring(1)
            .match(new RegExp(".{2}", "g"))
            .map((x) => parseInt(x, 16));
    }

    export function stringToColor(str) {
        if (cache.color[str]) {
            return cache.color[str];
        }

        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        var color = "#";
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xff;
            color += ("00" + value.toString(16)).substr(-2);
        }

        cache.color[str] = color;

        return color;
    }

    export function complimentaryColor(hex) {
        if (cache.compliment[hex]) {
            return cache.compliment[hex];
        }

        var rgb = hexToRgb(hex);

        // Counting the perceptive luminance - human eye favors green color...
        var luminance =
            (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;

        var result = luminance > 0.5 ? "#000" : "#fff";

        cache.compliment[hex] = result;

        return result;
    }
</script>

<script>
    import type {
        FormInstance,
        OutputController,
        UimfApp,
    } from "../../ts/framework";
    import { tooltip } from "../components/Tooltip.svelte";

    export let app: UimfApp;
    export let field: OutputController;
    export let form: FormInstance;

    let bg = stringToColor(field.data.Label);
    let color = complimentaryColor(bg);
</script>

<span
    use:tooltip={field.data.Tooltip}
    class="badge"
    style="background-color: {bg}; color: {color}">
    {field.data.Label}
</span>
