import { ElementTag } from "../../core/element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class PropertyInfo extends ElementTag {
    protected attributes = this.attributes as PropertyInfoAttributes;

    public convert(): string[] {
        throw new Error("Method not implemented.");
    }
}

interface PropertyInfoAttributes extends XMLSchemaElementAttributes {
    resource?: string;
    property?: string;
}
