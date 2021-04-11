import ConvertUtils from "../../../core/convert-utils";
import { IfComparing, IfComparingAttributes } from "./if-comparing";

export class IfValidateMethod extends IfComparing {
    public static readonly TAG = "if-validate-method";
    protected attributes = this.attributes as IfValidateMethodAttributes;
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

interface IfValidateMethodAttributes extends IfComparingAttributes {
    field: string;
    method: string;
    class?: string;
}
