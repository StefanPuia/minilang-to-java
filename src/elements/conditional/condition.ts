import { ElementTag } from "../element-tag";
export class Condition extends ElementTag {
    public convert(): string[] {
        return this.convertChildren();
    }
}
