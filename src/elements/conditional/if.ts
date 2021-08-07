import { ValidationMap } from "../../core/validate";
import { ConditionalElement } from "./conditional";
export class If extends ConditionalElement {
    public static readonly TAG = "if";

    public getValidation(): ValidationMap {
        return {
            childElements: ["condition", "then", "else-if", "else"],
            requiredChildElements: ["condition", "then"],
        };
    }

    public convert(): string[] {
        return [
            `if (${this.getCondition()}) {`,
            ...this.getThenBlock(),
            ...this.getElseIfBlocks(),
            ...this.getElseBlock(),
        ];
    }
}
