<script>
	import { UimfApp, UimfServer, ControlRegister, Menu, Content } from "../export.svelte.js";
	import "../src/style/bootstrap.scss";
	
	export let controlRegister: ControlRegister;

	const server = new UimfServer("/api/form/metadata", "/api/form/run");
	const app = new UimfApp(server, controlRegister);
	let menu = null;

	app.on("app:loaded", () => {
		menu = app.menu;

		document.addEventListener("click", function (e) {
			var el:any = e.target;
			if (el.tagName === "A") {
				e.preventDefault();
				app.router.goToUrl(el.href);
			}
		});
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