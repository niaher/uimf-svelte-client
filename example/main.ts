import { ControlRegister } from '../';
import { default as Layout } from './Layout.svelte';

new Layout({
	target: document.body,
	props: {
		controlRegister: new ControlRegister()
	}
});