import { CombinedCondition } from "./combined-condition";

export class Xor extends CombinedCondition {
    public static readonly TAG = "xor";

    public convert(): string[] {
        const conditions = this.getConditions();
        if (conditions.length === 0) {
            return ["true"];
        }
        return [`(${conditions.join(" ^ ")})`];
    }
}
