import * as axiosLib from "axios";
import { FormMetadata, FormResponse, FormResponseMetadata } from "../server";

const axios = axiosLib.default;

export class UimfServer {
	private readonly getMetadataUrl: string;
	private readonly postFormUrl: string;
	private eventHandlers: { [id: string]: IEventHandler[] } = {};

	/**
	 * Creates a new instance of UimfApp.
	 */
	constructor(getMetadataUrl: string, postFormUrl: string) {
		this.getMetadataUrl = getMetadataUrl;
		this.postFormUrl = postFormUrl;
	}

	public on(event: string, handler: IEventHandler): void {
		this.eventHandlers[event] = this.eventHandlers[event] || [];
		this.eventHandlers[event].push(handler);
	}

	private fire(event: string, params?: any): void {
		const handlersForEvent = this.eventHandlers[event];
		if (handlersForEvent != null && handlersForEvent.length > 0) {
			for (const handler of handlersForEvent) {
				handler(params);
			}
		}
	}

	public getMetadata(formId: string): Promise<FormMetadata> {
		this.fire("request:started");
		return axios.get(`${this.getMetadataUrl}/${formId}`).then((response: axiosLib.AxiosResponse) => {
			this.fire("request:completed");
			return response.data as FormMetadata;
		}).catch((e) => {
			// tslint:disable-next-line:no-console
			console.warn(`Did not find form "${formId}".`);
			this.fire("request:completed");
			return null;
		});
	}

	public getAllMetadata(): Promise<{ Forms: FormMetadata[], Menu: any }> {
		this.fire("request:started");
		return axios.get(this.getMetadataUrl).then((response: axiosLib.AxiosResponse) => {
			this.fire("request:completed");
			return response.data;
		});
	}

	public postForm(form: string, data: any): Promise<FormResponse> {
		this.fire("request:started");
		return axios.post(this.postFormUrl, JSON.stringify([{
			Form: form,
			RequestId: 1,
			InputFieldValues: data
		}]), {
			headers: {
				"Content-Type": "application/json"
			}
		}).then((response: axiosLib.AxiosResponse) => {
			const invokeFormResponses = response.data as InvokeFormResponse[];

			// Make sure metadata is never null.
			invokeFormResponses[0].Data.Metadata = invokeFormResponses[0].Data.Metadata || new FormResponseMetadata();
			this.fire("request:completed");
			return invokeFormResponses[0].Data;
		}).catch((error: axiosLib.AxiosError) => {
			this.fire("request:completed", error.response.data.error);
			return Promise.reject(error.response.data);
		});
	}
}

interface InvokeFormResponse {
	Data: FormResponse;
	RequestId: string;
}

type IEventHandler = (params?: any) => any;
