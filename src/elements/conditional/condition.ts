import { ElementTag } from "../../core/element-tag";
import { Else } from "./else";

export abstract class ConditionElement extends ElementTag {
    protected getElseBlock(): string[] {
        const elseElement = this.tag.elements?.find(
            (el) => el.type === "element" && el.name === "else"
        );
        if (elseElement) {
            return [...new Else(elseElement, this.converter, this).convert()];
        }
        return ["}"];
    }
}
