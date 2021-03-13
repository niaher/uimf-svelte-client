<script context="module">
    import { InputController, OutputControlConfiguration } from "../../ts/framework";
    import * as axiosLib from "axios";

    export const config = new OutputControlConfiguration(
        false,
        true,
        false,
        "file-upload"
    );

    export class Controller extends InputController<FileUploadValue> {
        public selectedFiles: any[] = [];
        public value: FileUploadValue = new FileUploadValue([]);

        public getValue(): Promise<FileUploadValue> {
            if (this.selectedFiles == null || this.selectedFiles.length == 0) {
                return Promise.resolve(null);
            }

            var selected: any[] = Array.from(this.selectedFiles);
            var toUpload = selected.filter((t) => t.UploadedFileId == null);

            var promises = toUpload.map((file) => {
                const formData = new FormData();
                formData.append("file", file);

                // Make http request to upload the files.
                axiosLib.default
                    .post("/file/upload", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        if (
                            response.data.FileIds != null &&
                            response.data.FileIds.length > 0
                        ) {
                            file.UploadedFileId = response.data.FileIds[0];
                        }
                    });
            });

            Promise.all(promises).then(() => {
                var fileIds = selected.map((t) => t.UploadedFileId);
                return Promise.resolve(new FileUploadValue(fileIds));
            });
        }

        public deserialize(value: string): Promise<FileUploadValue> {
            if (value == null) {
                return Promise.resolve(null);
            }

            var files = value.split(",").map((t) => parseInt(t));
            var result = new FileUploadValue(files);
            return Promise.resolve(result);
        }

        public serialize(value: FileUploadValue): string {
            if (
                value == null ||
                value.Files == null ||
                value.Files.length === 0
            ) {
                return null;
            }

            return value.Files.join(",");
        }
    }

    class FileUploadValue {
        constructor(files?: number[]) {
            this.Files = files || [];
        }

        public Files: number[] = [];
    }
</script>

<script>
    import type { FormInstance, UimfApp }from "../../ts/framework";
    import { filesize } from "../outputs/FileSize.svelte";

    export let app: UimfApp;
    export let form: FormInstance;
    export let field: Controller;

    var config = field.metadata.getCustomProperty("FileUploaderConfig") || {
        AllowMultipleFiles: false,
        AllowedFileExtensions: null,
    };

    let id = form.metadata.Id + "-" + field.metadata.Id;
    let tabindex = 0;
</script>

<div class="wrapper">
    <input
        type="file"
        class="form-control"
        {id}
        {tabindex}
        on:change={(e) => {
            let fileList = e.target.files;
            let files = Array.from(Object.keys(fileList), (k) => fileList[k]);
            let all = field.selectedFiles.concat(files);

            field.selectedFiles =
                !config.AllowMultipleFiles && all.length > 1
                    ? [all[all.length - 1]]
                    : all;
        }}
        multiple={config.AllowMultipleFiles}
        accept={config.AllowedFileExtensions}
    />

    <ul>
        {#each field.selectedFiles as file}
            <li>
                {#if file.UploadedFileId != null}
                    <a href="/file/download?id={file.UploadedFileId}"
                        >{file.name}</a
                    >
                {:else}
                    {file.name}
                {/if}
                <small>{filesize(file.size)}</small>
            </li>
        {/each}
    </ul>
</div>

<style>
    .wrapper {
        width: 100%;
    }

    .wrapper > ul {
        margin-top: 25px;
    }
</style>
