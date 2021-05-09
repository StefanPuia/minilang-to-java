import { CombinedCondition } from "./combined-condition";

export class Not extends CombinedCondition {
    public static readonly TAG = "not";

    public convert(): string[] {
        const conditions = this.getConditions();
        if (conditions.length === 0) {
            return ["true"];
        }
        return [`!${conditions[0]}`];
    }
}
