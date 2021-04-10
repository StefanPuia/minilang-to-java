import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class NumberElement extends ElementTag {
    protected attributes = this.attributes as NumberElementAttributes;

    public convert(): string[] {
        return [this.converter.parseValue(this.attributes.value)];
    }
}

interface NumberElementAttributes extends XMLSchemaElementAttributes {
    value: string;
}
