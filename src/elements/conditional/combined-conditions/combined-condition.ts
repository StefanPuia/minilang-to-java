import { ValidationMap } from "../../../core/validate";
import { ElementTag } from "../../element-tag";

export abstract class CombinedCondition extends ElementTag {
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
}
