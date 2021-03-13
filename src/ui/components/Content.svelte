<script>
	import type { UimfApp } from "../../ts/framework";
	import { AppRouter } from "../../ts/routing";
	import {
		FormComponentResponseHandler,
		ReloadResponseHandler,
		RedirectResponseHandler,
	} from "../../ts/handlers";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import Modal, { bind } from "./Modal.svelte";
	import Toast from "./Toast.svelte";
	import Bootstrap from "./Bootstrap.svelte";
	import Form from "../Form.svelte";

	export let app: UimfApp;

	let container = null;
	const modal = writable(null);

	app.showModal = (component, props) => {
		modal.set(bind(component, props));
	};

	app.closeModal = () => {
		modal.set(null);
	};

	const toasts = writable([]);
	app.showToast = (args) => {
		toasts.update((value) => {
			var item = {
				heading: args.heading,
				message: args.message,
				style: args.style,
			};

			// Show toast.
			value.push(item);

			// Remove toast after some time.
			setTimeout(() => {
				toasts.update((v) => v.filter((c) => c !== item));
			}, 8000);

			return value;
		});
	};

	onMount(async () => {
		const router = new AppRouter(container, app, Form, "account");
		app.useRouter(router);

		app.registerResponseHandler(new FormComponentResponseHandler());
		app.registerResponseHandler(new ReloadResponseHandler(app));
		app.registerResponseHandler(new RedirectResponseHandler(router));

		await app.load();
	});
</script>

<Bootstrap controlRegister={app.controlRegister} />

<Toast {toasts} />

<Modal
	show={$modal}
	closeOnOuterClick={false}
	styleWindow={{ "min-width": "900px", width: "80%" }}
/>

<div bind:this={container} />
