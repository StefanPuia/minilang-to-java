import { ElementTag } from "../element-tag";
export class And extends ElementTag {
    public static readonly TAG = "and";
    public convert(): string[] {
        return [`(${this.convertChildren().join(" && ")})`];
    }
}
