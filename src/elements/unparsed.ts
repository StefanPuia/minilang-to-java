import { ElementTag } from './element-tag';

export class UnparsedElement extends ElementTag {
    public convert(): string[] {
        return this.convertChildren();
    }
}
