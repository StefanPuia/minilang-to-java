import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class SelectField extends ElementTag {
    public static readonly TAG = "select-field";
    protected attributes = this.attributes as SelectFieldAttributes;

    public convert(): string[] {
        return [this.getFieldName()];
    }

    public getFieldName() {
        return this.attributes["field-name"];
    }
}

interface SelectFieldAttributes extends XMLSchemaElementAttributes {
    "field-name": string;
}
