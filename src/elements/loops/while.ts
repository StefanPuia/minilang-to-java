import { ValidationMap } from "../../core/validate";
import { Condition } from "../conditional/condition";
import { Then } from "../dummy/then";
import { LoopingElement } from "./looping";

export class While extends LoopingElement {
    public static readonly TAG = "while";

    public getValidation(): ValidationMap {
        return {
            childElements: ["condition", "then"],
            requiredChildElements: ["condition", "then"],
        };
    }

    public convert(): string[] {
        const condition = this.parseChildren().find(
            (tag) => tag.getTagName() === Condition.TAG
        ) as Condition;
        const then = this.parseChildren().find(
            (tag) => tag.getTagName() === Then.TAG
        ) as Then;
        return [
            `while (${condition.convert()}) {`,
            ...then.convert().map(this.prependIndentationMapper),
            "}",
        ];
    }
}
