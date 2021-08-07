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

    public getMessage(): string {
        return this.getTagName();
    }
}

interface PropertyInfoAttributes extends XMLSchemaElementAttributes {
    resource?: string;
    property?: string;
}
