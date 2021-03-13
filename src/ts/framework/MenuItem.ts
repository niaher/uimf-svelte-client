import { FormLink } from "../server";

export class MenuItem extends FormLink {
	public Label: string;
	public OrderIndex: number;
	public Children: MenuItem[];
}
