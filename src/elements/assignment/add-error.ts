import { ValidationMap } from "../../core/validate";
import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class AddError extends ElementTag {
    public static readonly TAG = "add-error";
    protected attributes = this.attributes as AddErrorAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["error-list-name"],
            constantAttributes: ["error-list-name"],
            childElements: ["fail-message", "fail-property"],
            requireAnyChildElement: ["fail-message", "fail-property"],
        };
    }

    public convert(): string[] {
        return this.convertChildren();
    }
}

interface AddErrorAttributes extends XMLSchemaElementAttributes {
    "error-list-name"?: string;
}
