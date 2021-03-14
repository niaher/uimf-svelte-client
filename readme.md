# UIMF Svelte Client

This is a general-purpose UIMF client implemented in Svelte 3.

The server for this app is implemented in https://github.com/niaher/uimf-app.

## How to use

1. Install the npm package with `npm install uimf-svelte-client --save-dev`.
2. Copy `svelte.config.js` into your root directory.
3. Copy `rollup.config.js` into your root directory. Adjust the file as needed and make sure to set correct values for `disDir` and `app` (entry point to your application).
4. Copy `tsconfig.json` into your root directory.
4. Set up these scripts in your `package.json`:
    ```json
    "build": "rollup --config",
    "dev": "rollup --config --watch"
    ```

## Sample usage

Creating an app is as simple as creating a svelte component like this one:

```typescript
<script>
	import { UimfApp, UimfServer, ControlRegister, Menu, Content  } from "uimf-svelte-client";
	import "uimf-svelte-client/src/style/bootstrap.scss";
	
	export let controlRegister: ControlRegister;

	const server = new UimfServer("/api/form/metadata", "/api/form/run");
	const app = new UimfApp(server, controlRegister);
	let menu = null;

	app.on("app:loaded", () => {
		menu = app.menu;
	});
</script>

<main class="container-fluid">
	<div class="row">
		<div class="col-sm-2">
			<Menu {app} {menu} />
		</div>
		<div class="col-sm-10">
			<Content {app} />
		</div>
	</div>
</main>
```