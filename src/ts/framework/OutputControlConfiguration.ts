export class OutputControlConfiguration {
	public alwaysHideLabel: boolean = false;
	public displayAsBlock: boolean = true;
	public hideIfNull: boolean = false;
	public type: string = null;

	constructor(alwaysHideLabel: boolean = false, displayAsBlock: boolean = true, hideIfNull: boolean = false, type: string = null) {
		this.type = type;
		this.alwaysHideLabel = alwaysHideLabel;
		this.displayAsBlock = displayAsBlock;
		this.hideIfNull = hideIfNull;
	}
}
