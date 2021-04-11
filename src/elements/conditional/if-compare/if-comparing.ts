import { XMLSchemaElementAttributes } from "../../../types";
import { ConditionalElement } from "../conditional";

export abstract class IfComparing extends ConditionalElement {
    protected attributes = this.attributes as IfComparingAttributes;

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

    protected getFieldType() {
        const variable = this.getVariableFromContext(this.attributes.field);
        return variable?.type ?? this.attributes.type;
    }
}
export interface IfComparingAttributes extends XMLSchemaElementAttributes {
    field: string;
    type?: string;
}
