import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class RemoveValue extends ElementTag {
    public static readonly TAG = "remove-value";
    protected attributes = this.attributes as RemoveValueAttributes;

    public convert(): string[] {
        this.addException("GenericEntityException");
        return [
            `${
                ConvertUtils.parseFieldGetter(this.attributes["value-field"]) ??
                this.attributes["value-field"]
            }.remove();`,
        ];
    }

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["do-cache-clear"],
        };
    }
}

interface RemoveValueAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "do-cache-clear"?: StringBoolean;
}
