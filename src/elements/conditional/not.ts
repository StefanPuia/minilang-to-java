import { ElementTag } from "../element-tag";

export class Not extends ElementTag {
    public convert(): string[] {
        return this.convertChildren();
    }
}
