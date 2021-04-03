import { ElementTag } from "../../core/element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class FailProperty extends ElementTag {
    protected attributes = this.attributes as FailPropertyAttributes;
    public convert(): string[] {
        this.converter.addImport("MiscUtils");
        return this.converter
            .getErrorHandler()
            .returnError(
                `MiscUtils.getSingleLabel("${this.attributes.resource}", "${this.attributes.property}")`
            );
    }
}

interface FailPropertyAttributes extends XMLSchemaElementAttributes {
    resource: string;
    property: string;
}
