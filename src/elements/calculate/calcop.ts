import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class Calcop extends ElementTag {
    public static readonly TAG = "calcop";
    protected attributes = this.attributes as CalcopRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "operator"],
            requiredAttributes: ["operator"],
            expressionAttributes: ["field"],
            childElements: ["calcop", "number"],
        };
    }

    private getAttributes(): CalcopAttributes {
        return {
            operator: "add",
            ...this.attributes,
        };
    }

    private getOperator(): Operator {
        return this.getAttributes().operator;
    }

    private negate() {
        return `((${this.getFields().join(" + ")}) * -1)`;
    }
    private value() {
        return this.getFields().join(" + ");
    }

    private getFields(): string[] {
        return [this.getAttributes().field, ...this.convertChildren()].filter(
            Boolean
        ) as string[];
    }

    private basicOp(operator: string) {
        return this.getFields().join(` ${operator} `);
    }

    public convert(): string[] {
        switch (this.getOperator()) {
            case "add":
                return [this.basicOp("+")];
            case "subtract":
                return [this.basicOp("+")];
            case "multiply":
                return [this.basicOp("+")];
            case "divide":
                return [this.basicOp("+")];
            case "get":
                return [this.value()];
            case "negative":
                return [this.negate()];
        }
    }
}

type Operator = "get" | "add" | "subtract" | "multiply" | "divide" | "negative";

interface CalcopRawAttributes extends XMLSchemaElementAttributes {
    field?: string;
    operator?: Operator;
}

interface CalcopAttributes {
    field?: FlexibleMapAccessor;
    operator: Operator;
}
