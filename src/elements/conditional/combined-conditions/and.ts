import { CombinedCondition } from "./combined-condition";

export class And extends CombinedCondition {
    public static readonly TAG = "and";

    public convert(): string[] {
        const conditions = this.getConditions();
        if (conditions.length === 0) {
            return ["true"];
        }
        return [`(${conditions.join(" && ")})`];
    }
}
