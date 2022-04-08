import { ElementTag } from "../element-tag";
import {
    XMLSchemaElementAttributes,
    StringBoolean,
    FlexibleMapAccessor,
} from "../../types";
import { ValidationMap } from "../../core/validate";
import ConvertUtils from "../../core/utils/convert-utils";

export class CreateValue extends ElementTag {
    public static readonly TAG = "create-value";
    protected attributes = this.attributes as CreateValueRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["value-field", "do-cache-clear", "or-store"],
            deprecatedAttributes: ["do-cache-clear"],
            unhandledAttributes: ["do-cache-clear"],
            requiredAttributes: ["value-field"],
            expressionAttributes: ["value-field"],
            constantAttributes: ["do-cache-clear", "or-store"],
            noChildElements: true,
        };
    }

    private getAttributes(): CreateValueAttributes {
        return {
            valueField: this.attributes["value-field"],
            doCacheClear: this.attributes["do-cache-clear"] !== "false",
            createOrStore: this.attributes["or-store"] === "true",
        };
    }

    public convert() {
        const { valueField, createOrStore } = this.getAttributes();
        const method = createOrStore ? "createOrStore" : "create";
        this.setVariableToContext({ name: "delegator" });
        return [
            `delegator.${method}(${
                ConvertUtils.parseFieldGetter(valueField) ?? valueField
            });`,
        ];
    }
}

interface CreateValueRawAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "do-cache-clear"?: StringBoolean;
    "or-store"?: StringBoolean;
}

interface CreateValueAttributes {
    valueField: FlexibleMapAccessor;
    doCacheClear: boolean;
    createOrStore: boolean;
}
