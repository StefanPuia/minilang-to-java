import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes, StringBoolean } from "../../types";
import ConvertUtils from "../../core/convert-utils";
export class ConditionExpr extends ElementTag {
    protected attributes = this.attributes as ConditionExprAttributes;

    public convert(): string[] {
        const [method, ...args] = this.getMethodAndArgs();
        return this.wrapIgnoreCase([`.${method}(${args.join(", ")})`]);
    }

    private wrapIgnoreCase(method: string[]) {
        if (!this.attributes["ignore-case"]) {
            return method;
        }
        return [
            `.caseInsensitive()`,
            ...method.map(this.prependIndentationMapper),
            `.caseSensitive()`,
        ];
    }

    private getMethodAndArgs(): MethodReturn {
        switch (this.attributes.operator) {
            case "less":
                return ["lt", ...this.getFieldAndValue()];
            case "greater":
                return ["gt", ...this.getFieldAndValue()];
            case "less-equals":
                return ["ltEq", ...this.getFieldAndValue()];
            case "greater-equals":
                return ["gtEq", ...this.getFieldAndValue()];
            case "not-equals":
                return ["notEq", ...this.getFieldAndValue()];
            case "in":
                return ["in", ...this.getFieldAndValue()];
            case "not-in":
                return ["notIn", ...this.getFieldAndValue()];
            case "between":
                return ["between", ...this.getFieldAndValue()];
            case "like":
                return ["like", ...this.getFieldAndValue()];
            case "not-like":
                return ["notLike", ...this.getFieldAndValue()];
            default:
            case "equals":
                return ["eq", ...this.getFieldAndValue()];
        }
    }

    private getValue() {
        return (
            ConvertUtils.parseFieldGetter(this.attributes["from-field"]) ??
            this.converter.parseValueOrInitialize(
                undefined,
                this.attributes.value
            ) ??
            this.attributes.value
        );
    }

    private getField() {
        return this.converter.parseValue(this.attributes["field-name"]);
    }

    private getFieldAndValue(): string[] {
        return [this.getField(), this.getValue() as string];
    }

    protected getUnsupportedAttributes() {
        return ["ignore-if-null", "ignore-if-empty", "ignore"];
    }
}

type MethodReturn = [method: string, ...args: string[]];

interface ConditionExprAttributes extends XMLSchemaElementAttributes {
    "field-name": string;
    operator:
        | "less"
        | "greater"
        | "less-equals"
        | "greater-equals"
        | "equals"
        | "not-equals"
        | "in"
        | "not-in"
        | "between"
        | "like"
        | "not-like";
    "from-field"?: string;
    value?: string;
    "ignore-if-null": StringBoolean;
    "ignore-if-empty": StringBoolean;
    "ignore-case": StringBoolean;
    ignore: StringBoolean;
}
