import ConvertUtils from "../../../core/convert-utils";
import { ValidationMap } from "../../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    Operator,
} from "../../../types";
import {
    IfComparing,
    IfComparingAttributes,
    IfComparingRawAttributes,
} from "./if-comparing";

export class IfCompareField extends IfComparing {
    public static readonly TAG = "if-compare-field";
    protected attributes = this.attributes as IfCompareFieldRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "format", "operator", "type", "to-field"],
            requiredAttributes: ["field", "operator", "to-field"],
            constantAttributes: ["operator", "type"],
            constantPlusExpressionAttributes: ["format"],
            expressionAttributes: ["field", "to-field"],
        };
    }

    protected getAttributes(): IfCompareFieldAttributes {
        return {
            ...super.getAttributes(),
            format: this.attributes.format,
            operator: this.attributes.operator as Operator,
            toField: this.attributes["to-field"],
        };
    }

    protected getValue() {
        const attributes = (this
            .attributes as unknown) as IfCompareFieldRawAttributes;
        return (
            this.converter.parseValueOrInitialize(
                this.getFieldType(),
                ConvertUtils.parseFieldGetter(attributes["to-field"])
            ) ??
            ConvertUtils.parseFieldGetter(attributes["to-field"]) ??
            attributes["to-field"]
        );
    }

    protected convertCondition(): string {
        const { field, operator, toField } = this.getAttributes();
        return this.getComparison(
            ConvertUtils.parseFieldGetter(field) ?? field,
            operator,
            ConvertUtils.parseFieldGetter(toField) ?? toField
        );
    }
}

interface IfCompareFieldRawAttributes extends IfComparingRawAttributes {
    "operator": string;
    "to-field": string;
    "format"?: string;
}

interface IfCompareFieldAttributes extends IfComparingAttributes {
    format?: FlexibleStringExpander;
    operator: Operator;
    toField: FlexibleMapAccessor;
}
