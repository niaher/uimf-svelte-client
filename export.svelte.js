import * as inputs from "./src/ui/inputs";
import * as outputs from "./src/ui/outputs";

// Inputs.
export { default as BooleanInput } from inputs.Boolean;
export { default as DateInput } from inputs.Date;
export { default as DropdownInput } from inputs.Dropdown;
export { default as EmailInput } from inputs.Email;
export { default as FileUploadInput } from inputs.FileUpload;
export { default as MultiselectInput } from inputs.Multiselect;
export { default as NumberInput } from inputs.Number;
export { default as PaginatorInput } from inputs.Paginator;
export { default as PasswordInput } from inputs.Password;
export { default as TextInput } from inputs.Text;
export { default as TextareaInput } from inputs.Textarea;
export { default as TypeaheadInput } from inputs.Typeahead;

// Outputs.
export { default as ActionList } from outputs.ActionList;
export { default as Datetime } from outputs.Datetime;
export { default as FileSize } from outputs.FileSize;
export { default as FormLink } from outputs.FormLink;
export { default as HtmlString } from outputs.HtmlString;
export { default as Image } from outputs.Image;
export { default as InlineForm } from outputs.InlineForm;
export { default as Json } from outputs.Json;
export { default as Link } from outputs.Link;
export { default as List } from outputs.List;
export { default as Number } from outputs.Number;
export { default as PaginatedData } from outputs.PaginatedData;
export { default as PreformattedText } from outputs.PreformattedText;
export { default as Table } from outputs.Table;
export { default as Tabstrip } from outputs.Tabstrip;
export { default as Tag } from outputs.Tag;
export { default as Text } from outputs.Text;

// Top level uimf components.
export { default as Form } from "./src/ui/Form.svelte";
export { default as Output } from "./src/ui/Output.svelte";
export { default as Input } from "./src/ui/Input.svelte";

// App level components.
export { default as Bootstrap } from "./src/ui/components/Bootstrap.svelte";
export { default as Home } from "./src/ui/components/Home.svelte";
export { default as Content } from "./src/ui/components/Content.svelte";
export { default as Menu } from "./src/ui/components/Menu.svelte";
export { default as Modal } from "./src/ui/components/Modal.svelte";
export { default as Toast } from "./src/ui/components/Toast.svelte";
export { default as Tooltip } from "./src/ui/components/Tooltip.svelte";