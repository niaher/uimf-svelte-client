<script context="module">
    import { OutputControlConfiguration } from "../../ts/framework";

    export const config = new OutputControlConfiguration(false, false, false, "file-size");

    export function filesize(bytes) {
        const si = true;
        const thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return `${bytes} B`;
        }

        const units = si
            ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
            : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

        let u = -1;
        let result = bytes;

        do {
            result /= thresh;
            u += 1;
        } while (Math.abs(result) >= thresh && u < units.length - 1);

        return `${result.toFixed(1)} ${units[u]}`;
    };
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

    let display = filesize(field.data.Bytes);
</script>

<span class="text-nowrap">{display}</span>
