import { Operator, XMLSchemaElementAttributes } from "../../types";
import { ConditionElement } from "./condition";

export class IfCompare extends ConditionElement {
    protected attributes = this.attributes as IfCompareAttributes;

    public convert(): string[] {
        return [
            `if (${this.getComparison(
                this.attributes.field,
                this.attributes.operator,
                this.attributes.value
            )}) {`,
            ...this.convertChildren(),
            ...this.getElseBlock(),
        ];
    }

    protected getUnsupportedAttributes() {
        return ["format"];
    }
}

interface IfCompareAttributes extends XMLSchemaElementAttributes {
    field: string;
    operator: Operator;
    value: string;
    type?: string;
    format?: string;
}
