import { ElementTag } from "../element-tag";
export class And extends ElementTag {
    public convert(): string[] {
        return [`(${this.convertChildren().join(" && ")})`];
    }
}
