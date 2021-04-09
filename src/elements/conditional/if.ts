import { ConditionalElement } from './conditional';
export class If extends ConditionalElement {
    public convert(): string[] {
        return [
            `if (${this.getNegated()}${this.getCondition()}) {`,
            ...this.getThenBlock(),
            ...this.getElseIfBlocks(),
            ...this.getElseBlock(),
        ]
    }
}