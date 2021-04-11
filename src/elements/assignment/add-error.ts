import { ElementTag } from "../element-tag";

export class AddError extends ElementTag {
    public static readonly TAG = "add-error";

    public convert(): string[] {
        return this.convertChildren();
    }
}