import type { ClientFunctionMetadata } from "../server";
import type { IFunctionRunner, UimfApp } from "../framework";

export class Toast implements IFunctionRunner {
	public run(metadata: ClientFunctionMetadata, app: UimfApp, args?: any): Promise<void> {
		var style = "";

		switch (metadata.CustomProperties.Style) {
			case "success":
				style = "bg-success text-white";
				break;
			case "warning":
				style = "bg-warning text-dark";
				break;
			case "danger":
				style = "bg-danger text-white";
				break;
		}

		app.showToast({
			heading: metadata.CustomProperties.Heading,
			message: metadata.CustomProperties.Message,
			style: style
		});

		return Promise.resolve();
	}
}