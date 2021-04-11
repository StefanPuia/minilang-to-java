import { ElementTag } from "../element-tag";
export class Or extends ElementTag {
    public static readonly TAG = "or";
    public convert(): string[] {
        return [`(${this.convertChildren().join(" || ")})`];
    }
}
