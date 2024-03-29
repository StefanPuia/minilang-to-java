import { Field } from "../assignment/field";
import { SetterElement } from "../assignment/setter";
import { StringTag } from "../assignment/string";

export abstract class CallerElement extends SetterElement {
    protected getFields(): string {
        return [
            ...this.parseChildren()
                .filter(
                    (tag) => tag instanceof Field || tag instanceof StringTag
                )
                .map((tag) => tag.convert()),
        ].join(", ");
    }
}
