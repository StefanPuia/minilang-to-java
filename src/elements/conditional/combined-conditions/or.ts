import { CombinedCondition } from "./combined-condition";

export class Or extends CombinedCondition {
    public static readonly TAG = "or";

    public convert(): string[] {
        const conditions = this.getConditions();
        if (conditions.length === 0) {
            return ["true"];
        }
        return [`(${conditions.join(" || ")})`];
    }
}
