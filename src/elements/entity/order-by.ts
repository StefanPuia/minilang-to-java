import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class OrderBy extends ElementTag {
    public static readonly TAG = "order-by";
    protected attributes = this.attributes as OrderBydAttributes;

    public convert(): string[] {
        return [this.getFieldName()];
    }
    public getFieldName() {
        return this.attributes["field-name"];
    }
}

interface OrderBydAttributes extends XMLSchemaElementAttributes {
    "field-name": string;
}
