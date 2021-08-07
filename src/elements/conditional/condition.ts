import { ConditionalElement } from "./conditional";

export class Condition extends ConditionalElement {
    public static readonly TAG = "condition";

    public convert(): string[] {
        return this.convertChildren();
    }
}
