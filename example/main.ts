import { ControlRegister } from '../';
import { default as Layout } from '../src/ui/components/Layout.svelte';

new Layout({
	target: document.body,
	props: {
		controlRegister: new ControlRegister()
	}
});