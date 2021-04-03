import { ElementTag } from "../../core/element-tag";
import { ValidChildren } from "../../types";

export class SimpleMethods extends ElementTag {
    public getValidChildren(): ValidChildren {
        return {
            "simple-method": {
                min: 0,
                max: Infinity,
            },
        };
    }

    public convert(): string[] {
        return [
            "public class SomeClassName {",
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }
}
