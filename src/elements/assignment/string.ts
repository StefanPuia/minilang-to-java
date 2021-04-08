import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class StringTag extends ElementTag {
    protected attributes = this.attributes as FieldAttributes;

    public convert(): string[] {
        return [
            this.getValue()
        ];
    }

    public getValue(): string {
        return this.attributes?.value
            ? `"${this.attributes?.value}"`
            : this.convertChildren().join("");
    }
}

interface FieldAttributes extends XMLSchemaElementAttributes {
    value?: string;
}
