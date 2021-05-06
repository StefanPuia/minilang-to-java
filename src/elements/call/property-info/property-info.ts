import { ElementTag } from "../../element-tag";
import { XMLSchemaElementAttributes } from "../../../types";

export abstract class PropertyInfo extends ElementTag {
    protected attributes = this.attributes as PropertyInfoAttributes;

    public convert(): string[] {
        return [
            `// Parser not defined for element "${this.getTagName()}"`,
            ...this.convertChildren(),
        ];
    }

    public abstract getMessage(): string;
}

interface PropertyInfoAttributes extends XMLSchemaElementAttributes {
    resource?: string;
    property?: string;
}
