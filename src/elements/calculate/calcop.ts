import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class Calcop extends ElementTag {
    protected attributes = this.attributes as CalcopAttributes;

    private getOperator(): Operator {
        return this.attributes.operator ?? "add";
    }

    private negate() {
        return `((${this.getFields().join(" + ")}) * -1)`;
    }
    private value() {
        return this.getFields().join(" + ");
    }

    private getFields(): string[] {
        return [this.attributes.field, ...this.convertChildren()].filter(
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

interface CalcopAttributes extends XMLSchemaElementAttributes {
    field?: string;
    operator?: Operator;
}
