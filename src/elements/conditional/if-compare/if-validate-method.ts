import ConvertUtils from "../../../core/convert-utils";
import { ValidationMap } from "../../../core/validate";
import { JavaClassName } from "../../../types";
import {
    IfComparing,
    IfComparingAttributes,
    IfComparingRawAttributes
} from "./if-comparing";

export class IfValidateMethod extends IfComparing {
    public static readonly TAG = "if-validate-method";
    protected attributes = this.attributes as IfValidateMethodRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "method", "class"],
            requiredAttributes: ["field", "method"],
            constantAttributes: ["method", "class"],
            expressionAttributes: ["field"],
        };
    }

    protected getAttributes(): IfValidateMethodAttributes {
        return {
            ...super.getAttributes(),
            method: this.attributes.method,
            class: this.attributes.class ?? "UtilValidate",
        };
    }

    protected convertCondition() {
        return `${this.getNegated()}${this.getValidator()}`;
    }

    private getValidator() {
        const { class: validatorClass, method, field } = this.getAttributes();
        this.converter.addImport(validatorClass);
        return `${ConvertUtils.unqualify(validatorClass)}.${method}(${
            ConvertUtils.parseFieldGetter(field) ?? field
        })`;
    }
}

interface IfValidateMethodRawAttributes extends IfComparingRawAttributes {
    method: string;
    class?: string;
}

interface IfValidateMethodAttributes extends IfComparingAttributes {
    method: string;
    class: JavaClassName;
}
