import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class FailProperty extends ElementTag {
    public static readonly TAG = "fail-property";
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
