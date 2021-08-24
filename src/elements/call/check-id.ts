import { ValidationMap } from "../../core/validate";
import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class CheckId extends ElementTag {
    public static readonly TAG = "check-id";
    protected attributes = this.attributes as CheckIdAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "error-list-name"],
            requiredAttributes: ["field"],
            constantAttributes: ["error-list-name"],
            expressionAttributes: ["field"],
            childElements: ["fail-message", "fail-property"],
        };
    }

    public convert(): string[] {
        return [];
    }
}

interface CheckIdAttributes extends XMLSchemaElementAttributes {}
