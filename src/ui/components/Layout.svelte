<script>
	import { UimfApp, UimfServer, ControlRegister } from "../../ts/framework";
	import Menu from "./Menu.svelte";
	import Content from "./Content.svelte";
	import "../../style/bootstrap.scss";
	
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