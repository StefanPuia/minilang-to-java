import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";
import { SimpleMethod } from "../root/simple-method";

export class Return extends ElementTag {
    public static readonly TAG = "return";
    protected attributes = this.attributes as ReturnAttributes;

    public convert() {
        return [`return ${this.getCode()};`];
    }

    private getCode() {
        return this.converter.parseValue(
            this.attributes?.["response-code"] ??
                (this.getParent(
                    "simple-method"
                ) as SimpleMethod).getDefaultSuccessCode()
        );
    }
}

interface ReturnAttributes extends XMLSchemaElementAttributes {
    "response-code"?: string;
}
