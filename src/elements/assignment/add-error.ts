import { ElementTag } from "../element-tag";

export class AddError extends ElementTag {
    public convert(): string[] {
        return this.convertChildren();
    }
}