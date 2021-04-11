import { ConditionalElement } from "./conditional";
export class If extends ConditionalElement {
    public static readonly TAG = "if";
    public convert(): string[] {
        return [
            `if (${this.getNegated()}${this.getCondition()}) {`,
            ...this.getThenBlock(),
            ...this.getElseIfBlocks(),
            ...this.getElseBlock(),
        ];
    }
}
