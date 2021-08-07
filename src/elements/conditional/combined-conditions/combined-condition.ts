import { ConditionBehavior } from "../../../behavior/condition";
import { ValidationMap } from "../../../core/validate";
import { ElementTag } from "../../element-tag";

export abstract class CombinedCondition extends ElementTag implements ConditionBehavior {
    public getValidation(): ValidationMap {
        if (this.parseChildren().length === 0) {
            this.converter.appendMessage(
                "ERROR",
                `No conditional elements found inside "${this.getTagName()}"`,
                this.position
            );
        }
        return {};
    }

    protected getConditions(): string[] {
        return this.convertChildren();
    }

    public convertConditionOnly(): string {
        return this.convert().join(" && ");
    }
}
