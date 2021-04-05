import ConvertUtils from "../../core/convert-utils";
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
        const primitive = ConvertUtils.isPrimitive(value);
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
                if (value === "true") return field;
                if (value === "false") return `!${field}`;
                return primitive ? `${field} == ${value}` : `${value}.equals(${field})`;
            case "not-equals":
                if (value === "true") return `!${field}`;
                if (value === "false") return field;
                return primitive ? `${field} != ${value}` : `!${value}.equals(${field})`;
            case "greater":
                return primitive ? `${field} > ${value}` : `${value}.compareTo(${field}) > 0`;
            case "greater-equals":
                return primitive ? `${field} >= ${value}` : `${value}.compareTo(${field}) >= 0`;
            case "less":
                return primitive ? `${field} < ${value}` : `${value}.compareTo(${field}) < 0`;
            case "less-equals":
                return primitive ? `${field} <= ${value}` : `${value}.compareTo(${field}) <= 0`;
        }
    }
}
