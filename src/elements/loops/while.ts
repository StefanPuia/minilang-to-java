import { ValidChildren, XMLSchemaElementAttributes } from "../../types";
import { Condition } from "../conditional/condition";
import { Then } from "../dummy/then";
import { LoopingElement } from "./looping";

export class While extends LoopingElement {
    public static readonly TAG = "while";

    public getValidChildren(): ValidChildren {
        return {
            condition: {
                min: 1,
                max: 1,
            },
            then: {
                min: 1,
                max: 1,
            },
        };
    }

    public convert(): string[] {
        const condition = this.parseChildren().find(
            (tag) => tag.getTagName() === Condition.TAG
        );
        const then = this.parseChildren().find(
            (tag) => tag.getTagName() === Then.TAG
        );
        return [
            `while (${(condition as Condition).convert()}) {`,
            ...(then as Then).convert().map(this.prependIndentationMapper),
            "}",
        ];
    }
}
