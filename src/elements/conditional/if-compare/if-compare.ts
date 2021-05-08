import ConvertUtils from "../../../core/convert-utils";
import { ValidationMap } from "../../../core/validate";
import { FlexibleStringExpander, Operator } from "../../../types";
import {
    IfComparing,
    IfComparingAttributes,
    IfComparingRawAttributes,
} from "./if-comparing";

export class IfCompare extends IfComparing {
    public static readonly TAG = "if-compare";
    protected attributes = this.attributes as IfCompareRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "format", "operator", "type", "value"],
            requiredAttributes: ["field", "operator", "value"],
            constantAttributes: ["operator", "type"],
            constantPlusExpressionAttributes: ["value"],
            expressionAttributes: ["field"],
        };
    }

    protected getAttributes(): IfCompareAttributes {
        return {
            ...super.getAttributes(),
            operator: this.attributes.operator as Operator,
            value: this.attributes.value,
            format: this.attributes.format,
        };
    }

    protected convertCondition() {
        return `${this.getNegated()}${this.getComparison(
            this.getField(),
            this.getAttributes().operator,
            this.getValue()
        )}`;
    }

    protected getField() {
        return (
            ConvertUtils.parseFieldGetter(this.getAttributes().field) ??
            this.getAttributes().field
        );
    }

    protected getValue() {
        return (
            this.converter.parseValueOrInitialize(
                this.getFieldType(),
                this.getAttributes().value
            ) ?? this.converter.parseValue(this.getAttributes().value)
        );
    }

    protected getUnsupportedAttributes() {
        return ["format"];
    }

    protected getFieldType() {
        const variable = this.getVariableFromContext(
            this.getAttributes().field
        );
        return variable?.type ?? this.getAttributes().type;
    }
}

interface IfCompareRawAttributes extends IfComparingRawAttributes {
    operator: string;
    value: string;
    format?: string;
}

interface IfCompareAttributes extends IfComparingAttributes {
    operator: Operator;
    value: FlexibleStringExpander;
    format?: FlexibleStringExpander;
}
