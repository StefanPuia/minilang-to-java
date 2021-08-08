import { ConditionBehaviour } from "../../behavior/condition";
import ConvertUtils from "../../core/convert-utils";
import { Operator } from "../../types";
import { ElementTag } from "../element-tag";

export abstract class ConditionalElement extends ElementTag implements ConditionBehaviour {
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

    protected convertCondition(): string {
        return "true";
    }

    protected hasOwnContext(): boolean {
        return true;
    }

    protected getElseBlock(endBracket: boolean = true): string[] {
        const elseElement = this.parseChildren().find(
            (el) => el.getTagName() === "else"
        );
        if (elseElement) {
            return elseElement.convert();
        }
        return (endBracket && ["}"]) || [];
    }

    protected getCondition(): string {
        const conditionElement = this.parseChildren().find(
            (el) => el.getTagName() === "condition"
        );
        if (conditionElement) {
            return conditionElement.convert().join(" && ");
        }
        return "true";
    }

    public convertConditionOnly(): string {
        return this.convertCondition();
    }

    protected getThenBlock(): string[] {
        const thenElement = this.parseChildren().find(
            (el) => el.getTagName() === "then"
        );
        if (thenElement) {
            return thenElement.convert().map(this.prependIndentationMapper);
        }
        return [];
    }

    protected getElseIfBlocks(): string[] {
        const elseIfElements = this.parseChildren().filter(
            (el) => el.getTagName() === "else-if"
        );
        if (elseIfElements?.length) {
            return [...elseIfElements.map((el) => el.convert()).flat()];
        }
        return [];
    }

    protected getComparison(field: string, operator: Operator, value: string) {
        const primitive = ConvertUtils.isPrimitive(value);
        const strippedVal = ConvertUtils.stripQuotes(value);
        switch (operator) {
            case "is-null":
                return `${field} == null`;
            case "is-not-null":
                return `${field} != null`;
            case "is-empty":
                this.converter.addImport("UtilValidate");
                return `UtilValidate.isEmpty(${field})`;
            case "contains":
                return `${field}.contains(${value})`;
            case "not-equals":
                if (strippedVal === "true") return `!${field}`;
                if (strippedVal === "false") return field;
                return primitive
                    ? `${field} != ${strippedVal}`
                    : `!${value}.equals(${field})`;
            case "greater":
                return primitive
                    ? `${field} > ${strippedVal}`
                    : `${value}.compareTo(${field}) > 0`;
            case "greater-equals":
                return primitive
                    ? `${field} >= ${strippedVal}`
                    : `${value}.compareTo(${field}) >= 0`;
            case "less":
                return primitive
                    ? `${field} < ${strippedVal}`
                    : `${value}.compareTo(${field}) < 0`;
            case "less-equals":
                return primitive
                    ? `${field} <= ${strippedVal}`
                    : `${value}.compareTo(${field}) <= 0`;
            case "equals":
            default:
                if (value === "true") return field;
                if (value === "false") return `!${field}`;
                return primitive
                    ? `${field} == ${strippedVal}`
                    : `${value}.equals(${field})`;
        }
    }
}
