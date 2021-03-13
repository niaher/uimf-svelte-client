import type { FormResponse } from "../server";
import type { FormInstance } from "./FormInstance";

export interface IFormResponseHandler {
	readonly name: string;
	handle(response: FormResponse, form: FormInstance): Promise<void>;
}
