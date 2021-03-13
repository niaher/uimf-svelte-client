import type { ClientFunctionMetadata } from "../server";
import type { UimfApp } from "./UimfApp";

export interface IFunctionRunner {
	run(params: ClientFunctionMetadata, app:UimfApp, args?:any): Promise<void>;
}
