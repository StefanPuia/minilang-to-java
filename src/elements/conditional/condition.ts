import { ElementTag } from "../element-tag";
export class Condition extends ElementTag {
    public static readonly TAG = "condition";
    public convert(): string[] {
        return this.convertChildren();
    }
}
