import { ElementTag } from "../../core/element-tag";

export class Else extends ElementTag {
    public convert(): string[] {
        return ["} else {", ...this.convertChildren().map(this.prependIndentationMapper), "}"];
    }
}
