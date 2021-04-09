import ConvertUtils from "../../core/convert-utils";
import { Operator, XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfCompare extends ConditionalElement {
    protected attributes = this.attributes as IfCompareAttributes;

    public convert(): string[] {
        if (this.parseChildren().length) {
            return [
                `if (${this.convertCondition()}) {`,
                ...this.parseChildren()
                    .filter(
                        (tag) => !["else", "else-if"].includes(tag.getTagName())
                    )
                    .map((tag) => tag.convert())
                    .flat()
                    .map(this.prependIndentationMapper),
                ...this.getElseIfBlocks(),
                ...this.getElseBlock(),
            ];
        } else {
            return [this.convertCondition()];
        }
    }

    private convertCondition() {
        return this.getComparison(
            this.getField(),
            this.attributes.operator,
            this.getValue()
        );
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

interface IfCompareAttributes extends XMLSchemaElementAttributes {
    field: string;
    operator: Operator;
    value: string;
    type?: string;
    format?: string;
}
