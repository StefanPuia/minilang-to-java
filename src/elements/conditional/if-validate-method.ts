import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { IfCompare } from "./if-compare";

export class IfValidateMethod extends IfCompare {
    protected convertCondition() {
        return `${this.getNegated()}${this.getValidator()}`;
    }

    private getValidator() {
        const attributes = (this
            .attributes as unknown) as IfValidateMethodAttributes;
        const validatorClass = attributes.class ?? "UtilValidate";
        this.converter.addImport(validatorClass);
        return `${ConvertUtils.unqualify(validatorClass)}.${
            attributes.method
        }(${
            ConvertUtils.parseFieldGetter(attributes.field) ?? attributes.field
        })`;
    }
}

interface IfValidateMethodAttributes extends XMLSchemaElementAttributes {
    field: string;
    method: string;
    class?: string;
}
