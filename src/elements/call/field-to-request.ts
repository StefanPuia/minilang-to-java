import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    MethodMode,
    XMLSchemaElementAttributes,
} from "../../types";
import { ElementTag } from "../element-tag";

export class FieldToRequest extends ElementTag {
    public static readonly TAG = "field-to-request";
    protected attributes = this.attributes as FieldToRequestRawAttributes;

    private getAttributes(): FieldToRequestAttributes {
        return {
            field: this.attributes.field,
            requestName:
                this.attributes["request-name"] ?? this.attributes.field,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "request-name"],
            requiredAttributes: ["field"],
            expressionAttributes: ["field"],
            noChildElements: true,
        };
    }

    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            const message = `"field-to-request" used outside of event environment. Line will be ignored.`;
            this.converter.appendMessage("WARNING", message, this.position);
            return [`// ${message}`];
        }
        this.setVariableToContext({ name: "request" });
        return [
            `request.setAttribute("${this.getRequestName()}", ${
                ConvertUtils.parseFieldGetter(this.getAttributes().field) ??
                this.getAttributes().field
            });`,
        ];
    }

    private getRequestName() {
        return this.getAttributes().requestName;
    }
}

interface FieldToRequestRawAttributes extends XMLSchemaElementAttributes {
    "field": string;
    "request-name"?: string;
}

interface FieldToRequestAttributes {
    field: FlexibleMapAccessor;
    requestName: FlexibleStringExpander;
}
