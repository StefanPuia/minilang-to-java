import { ElementTag } from "../element-tag";
import { SetterElement } from "../assignment/setter";
import { Field } from "../assignment/field";
import { StringTag } from "../assignment/string";

export abstract class CallerElement extends SetterElement {
    protected getFields(): string {
        return [
            ...this.parseChildren()
                .filter((tag) => tag instanceof Field)
                .map((tag) => (tag as Field).convert()),
            ...this.parseChildren()
                .filter((tag) => tag instanceof StringTag)
                .map((tag) => (tag as StringTag).convert()),
        ].join(", ");
    }
}
