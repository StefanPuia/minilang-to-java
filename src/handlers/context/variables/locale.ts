import { ContextVariable } from "./context-variable";

export class Locale extends ContextVariable {
    public getName(): string {
        return "locale";
    }
    public getType(): string {
        return "Locale";
    }
}
