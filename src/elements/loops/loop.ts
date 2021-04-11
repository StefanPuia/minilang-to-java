import { XMLSchemaElementAttributes } from "../../types";
import { LoopingElement } from "./looping";

export class Loop extends LoopingElement {
    public static readonly TAG = "loop";
    protected attributes = this.attributes as LoopAttributes;

    public convert(): string[] {
        const loopParents = this.getParents().filter(
            (el) => el.getTagName() === this.getTagName()
        ).length;
        const field = this.attributes.field ?? `_counter_${loopParents}`;
        const value = this.converter.parseValue(this.attributes.count);
        return [
            `for (int ${field} = 0; ${field} <= ${value}; ${field}++) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }
}

interface LoopAttributes extends XMLSchemaElementAttributes {
    count: string;
    field?: string;
}
