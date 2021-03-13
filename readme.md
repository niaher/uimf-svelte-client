# UIMF Svelte Client

This is a general-purpose UIMF client implemented in Svelte 3.

The server for this app is implemented in https://github.com/niaher/uimf-app.

## How to use

1. Install the npm package with `npm install uimf-svelte-client --save-dev`.
2. Copy `svelte.config.js` into your root directory.
3. Copy `rollup.config.js` into your root directory. Adjust the file as needed and make sure to set correct values for `disDir` and `app` (entry point to your application).
4. Set up these scripts in your `package.json`:
    ```json
    "build": "rollup --config",
    "dev": "rollup --config --watch"
    ```

## Sample usage

If you're happy with the defaults you can start using the client, by creating your app as soo:

```typescript
import { ControlRegister } from 'uimf-svelte-client';
import { default as Layout } from 'uimf-svelte-client/src/ui/components/Layout.svelte';

new Layout({
	target: document.body,
	props: {
		controlRegister: new ControlRegister()
	}
});
```

Otherwise you can create your version of `Layout.svelte` and use it instead.