import { ElementTag } from "../element-tag"

export class DummyTag extends ElementTag {
    public convert(): string[] {
        return this.convertChildren();
    }
}