import { ConditionBehaviour } from "../../../behavior/condition";
import {
    FlexibleMapAccessor,
    JavaClassName,
    XMLSchemaElementAttributes,
} from "../../../types";
import { ConditionalElement } from "../conditional";

export abstract class IfComparing
    extends ConditionalElement
    implements ConditionBehaviour
{
    protected attributes = this.attributes as IfComparingRawAttributes;

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

    protected getAttributes(): IfComparingAttributes {
        return {
            field: this.attributes.field,
            type: this.attributes.type ?? "String",
        };
    }

    protected getFieldType() {
        const variable = this.getVariableFromContext(this.attributes.field);
        return variable?.type ?? this.attributes.type;
    }

    public convertConditionOnly(): string {
        return this.convertCondition();
    }
}
export interface IfComparingRawAttributes extends XMLSchemaElementAttributes {
    field: string;
    type?: string;
}

export interface IfComparingAttributes {
    field: FlexibleMapAccessor;
    type: JavaClassName;
}
