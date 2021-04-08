import { ElementTag } from "../element-tag";
import { TextTag } from "../text-tag";
export class ScriptTag extends ElementTag {
    public convert(): string[] {
        return this.convertChildren();
    }
}

export class ScriptTextTag extends TextTag {
    public convert(): string[] {
        return super.convert();
    }
}