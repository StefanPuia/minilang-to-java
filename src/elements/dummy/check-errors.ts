import { ValidationMap } from "../../core/validate";
import {
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { SimpleMethod } from "../root/simple-method";
import { DummyTag } from "./dummy-tag";

export class CheckErrors extends DummyTag {
    public static readonly TAG = "check-errors";
    protected attributes = this.attributes as CheckErrorsRawAttributes;

    private getAttributes(): CheckErrorsAttributes {
        const methodErrorCode = this.getParent<SimpleMethod>(
            "simple-method"
        )?.getDefaultErrorCode() as string;
        return {
            errorCode: this.attributes["error-code"] ?? methodErrorCode,
            errorListName: this.attributes["error-list-name"] ?? "error_list",
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["error-code", "error-list-name"],
            noChildElements: true,
        };
    }

    public convert(): string[] {
        const { errorCode, errorListName } = this.getAttributes();
        return [`// Checking for errors in "${errorListName}" [status: ${errorCode}]`];
    }
}

interface CheckErrorsRawAttributes extends XMLSchemaElementAttributes {
    "error-code"?: string;
    "error-list-name"?: string;
}

interface CheckErrorsAttributes {
    errorCode: FlexibleStringExpander;
    errorListName: FlexibleStringExpander;
}
