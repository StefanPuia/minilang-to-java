import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class AddError extends ElementTag {
    public static readonly TAG = "add-error";
    protected attributes = this.attributes as AddErrorRawAttributes;

    private getAttributes(): AddErrorAttributes {
        return {
            "error-list-name":
                this.attributes["error-list-name"] ?? "error_list",
        };
    }

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

interface AddErrorRawAttributes extends XMLSchemaElementAttributes {
    "error-list-name"?: string;
}

interface AddErrorAttributes {
    "error-list-name": FlexibleMapAccessor;
}
