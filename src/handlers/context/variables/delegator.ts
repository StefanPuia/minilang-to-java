import { ContextVariable } from "./context-variable";

export class Delegator extends ContextVariable {
    public getName(): string {
        return "delegator";
    }
    public getType(): string {
        return "Delegator";
    }
}