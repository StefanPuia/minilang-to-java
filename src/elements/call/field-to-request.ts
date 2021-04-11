import ConvertUtils from "../../core/convert-utils";
import { MethodMode, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class FieldToRequest extends ElementTag {
    public static readonly TAG = "field-to-request";
    protected attributes = this.attributes as FieldToRequestAttributes;
    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            const message = `"field-to-request" used outside of event environment. Line will be ignored.`;
            this.converter.appendMessage("WARNING", message);
            return [`// ${message}`];
        }
        this.setVariableToContext({ name: "request" });
        return [
            `request.setAttribute("${this.getRequestName()}", ${
                ConvertUtils.parseFieldGetter(this.attributes.field) ??
                this.attributes.field
            });`,
        ];
    }

    private getRequestName() {
        return this.attributes["request-name"] ?? this.attributes.field;
    }
}

interface FieldToRequestAttributes extends XMLSchemaElementAttributes {
    "field": string;
    "request-name"?: string;
}
