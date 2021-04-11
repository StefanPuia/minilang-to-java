import ConvertUtils from "../../../core/convert-utils";
import { Operator } from "../../../types";
import { IfComparing, IfComparingAttributes } from "./if-comparing";

export class IfCompare extends IfComparing {
    public static readonly TAG = "if-compare";
    protected attributes = this.attributes as IfCompareAttributes;

    protected convertCondition() {
        return `${this.getNegated()}${this.getComparison(
            this.getField(),
            this.attributes.operator,
            this.getValue()
        )}`;
    }

    protected getField() {
        return (
            ConvertUtils.parseFieldGetter(this.attributes.field) ??
            this.attributes.field
        );
    }

    protected getValue() {
        return (
            this.converter.parseValueOrInitialize(
                this.getFieldType(),
                this.attributes.value
            ) ?? this.converter.parseValue(this.attributes.value)
        );
    }

    protected getUnsupportedAttributes() {
        return ["format"];
    }

    protected getFieldType() {
        const variable = this.getVariableFromContext(this.attributes.field);
        return variable?.type ?? this.attributes.type;
    }
}

interface IfCompareAttributes extends IfComparingAttributes {
    operator: Operator;
    value: string;
    format?: string;
}
