import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { LoopingElement } from "./looping";

export class Loop extends LoopingElement {
    public static readonly TAG = "loop";
    protected attributes = this.attributes as LoopRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["count", "field"],
            requiredAttributes: ["count"],
            expressionAttributes: ["count", "field"],
        };
    }

    private getAttributes(): LoopAttributes {
        return {
            ...this.attributes,
        };
    }

    public convert(): string[] {
        const field =
            this.getAttributes().field ?? this.getDefaultIteratingFieldName();
        const maxValue = this.converter.parseValue(this.getAttributes().count);
        return [
            `for (int ${field} = 0; ${field} < ${maxValue}; ${field}++) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getDefaultIteratingFieldName() {
        const loopDepth = this.getParents().filter(
            (el) => el.getTagName() === this.getTagName()
        ).length;
        return `_counter_${loopDepth}`;
    }
}

interface LoopRawAttributes extends XMLSchemaElementAttributes {
    count: string;
    field?: string;
}

interface LoopAttributes {
    count: FlexibleStringExpander;
    field?: FlexibleMapAccessor;
}
