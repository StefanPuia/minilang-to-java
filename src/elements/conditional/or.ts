import { ElementTag } from "../element-tag";
export class Or extends ElementTag {
    public convert(): string[] {
        return [`(${this.convertChildren().join(" || ")})`];
    }
}
