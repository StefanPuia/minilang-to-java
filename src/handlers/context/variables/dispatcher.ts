import { ContextVariable } from "./context-variable";

export class Dispatcher extends ContextVariable {
    public getName(): string {
        return "dispatcher";
    }
    public getType(): string {
        return "LocalDispatcher";
    }
}