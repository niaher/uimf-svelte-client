export interface IAppRouter {
	go: (form: string, params: any, keepDiscriminatorUnchanged: boolean) => void;
	makeUrl: (form: string, params: any, keepDiscriminatorUnchanged: boolean) => string;
	setFormUrlParams: (params: any) => void;
	getUrlParams: () => any;
	fire(eventName: string, params: any): void;
	on(eventName: string, fn: () => void): () => void;
	getCurrentFormId: () => string;
}
