import { ValidationMap } from "../../core/validate";
import { ConditionalElement } from "./conditional";

export class ElseIf extends ConditionalElement {
    public static readonly TAG = "else-if";

    public getValidation(): ValidationMap {
        return {
            childElements: ["condition", "then"],
            requiredChildElements: ["condition", "then"],
        };
    }

    public convert(): string[] {
        return [
            `} else if (${this.getCondition()}) {`,
            ...this.getThenBlock(),
            ...this.getElseIfBlocks(),
            ...this.getElseBlock(false),
        ];
    }
}
