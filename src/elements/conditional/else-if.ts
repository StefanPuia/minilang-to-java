import { If } from "./if";

export class ElseIf extends If {
    public convert(): string[] {
        return [
            `} else if (${this.getCondition()}) {`,
            ...this.getThenBlock(),
            ...this.getElseIfBlocks(),
            ...this.getElseBlock(false),
        ];
    }
}
