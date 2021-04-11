import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class ConditionList extends ElementTag {
    public static readonly TAG = "condition-list";
    protected attributes = this.attributes as ConditionListAttributes;

    public convert(): string[] {
        return [
            this.beginGroup(),
            ...this.convertChildren().map(this.prependIndentationMapper),
            this.endGroup(),
        ];
    }

    private beginGroup() {
        return `.${this.getCombine()}()`;
    }

    private endGroup() {
        const combineMap = {
            and: "endAnd",
            or: "endOr",
        };
        return `.${combineMap[this.getCombine()]}()`;
    }

    private getCombine() {
        return this.attributes?.combine ?? "and";
    }
}

interface ConditionListAttributes extends XMLSchemaElementAttributes {
    combine?: "and" | "or";
}
