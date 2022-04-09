import { ContextVariable } from "./context-variable";

export class TimeZone extends ContextVariable {
    public getName(): string {
        return "timeZone";
    }
    public getType(): string {
        return "TimeZone";
    }
}
