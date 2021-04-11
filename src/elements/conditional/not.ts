import { ElementTag } from "../element-tag";

export class Not extends ElementTag {
    public static readonly TAG = "not";
    public convert(): string[] {
        return this.convertChildren();
    }
}
