import { ElementTag } from "../../core/element-tag";
import { Operator } from "../../types";
import { Else } from "./else";

export abstract class ConditionElement extends ElementTag {
    protected getElseBlock(): string[] {
        const elseElement = this.tag.elements?.find(
            (el) => el.type === "element" && el.name === "else"
        );
        if (elseElement) {
            return [...new Else(elseElement, this.converter, this).convert()];
        }
        return ["}"];
    }

    protected getComparison(field: string, operator: Operator, value: string) {
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
            case "equals":
                return `${value}.equals(${field})`;
            case "not-equals":
                return `!${value}.equals(${field})`;
            case "greater":
                return `${field} > ${value}`;
            case "greater-equals":
                return `${field} >= ${value}`;
            case "less":
                return `${field} < ${value}`;
            case "less-equals":
                return `${field} <= ${value}`;
        }
    }
}
