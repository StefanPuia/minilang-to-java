import { ValidationMap } from "../../core/validate";
import {
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { ElementTag } from "../element-tag";
import { SimpleMethod } from "../root/simple-method";

export class Return extends ElementTag {
    public static readonly TAG = "return";
    protected attributes = this.attributes as ReturnRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["response-code"],
            noChildElements: true,
        };
    }

    private getAttributes(): ReturnAttributes {
        const methodDefaultSuccessCode = this.getParent<SimpleMethod>(
            "simple-method"
        )?.getDefaultSuccessCode() as string;
        return {
            responseCode:
                this.attributes["response-code"] ?? methodDefaultSuccessCode,
        };
    }

    public convert() {
        return [`return ${this.getCode()};`];
    }

    private getCode() {
        return this.converter.parseValue(this.getAttributes().responseCode);
    }
}

interface ReturnRawAttributes extends XMLSchemaElementAttributes {
    "response-code"?: string;
}

interface ReturnAttributes {
    responseCode: FlexibleStringExpander;
}
