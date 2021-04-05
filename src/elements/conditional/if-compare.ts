import ConvertUtils from "../../core/convert-utils";
import { Operator, XMLSchemaElementAttributes } from "../../types";
import { ConditionElement } from "./condition";

export class IfCompare extends ConditionElement {
    protected attributes = this.attributes as IfCompareAttributes;

    public convert(): string[] {
        return [
            `if (${this.getComparison(
                ConvertUtils.parseFieldGetter(this.attributes.field) ?? this.attributes.field,
                this.attributes.operator,
                this.converter.parseValueOrInitialize(
                    this.getFieldType(),
                    this.attributes.value
                ) ?? this.converter.parseValue(this.attributes.value)
            )}) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            ...this.getElseBlock(),
        ];
    }

    protected getUnsupportedAttributes() {
        return ["format"];
    }

    protected getFieldType() {
        const variable = this.parent?.getVariableContext()?.[this.attributes.field];
        return variable?.type ?? this.attributes.type;
    }
}

interface IfCompareAttributes extends XMLSchemaElementAttributes {
    field: string;
    operator: Operator;
    value: string;
    type?: string;
    format?: string;
}
