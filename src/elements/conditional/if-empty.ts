import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfEmpty extends ConditionalElement {
    public static readonly TAG = "if-empty";
    protected attributes = this.attributes as IfEmptyAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field"],
            requiredAttributes: ["field"],
            expressionAttributes: ["field"],
        };
    }

    protected convertCondition(): string {
        this.converter.addImport("UtilValidate");
        return `UtilValidate.isEmpty(${ConvertUtils.parseFieldGetter(
            this.attributes.field
        )})`;
    }
}

interface IfEmptyAttributes extends XMLSchemaElementAttributes {
    field: string;
}
