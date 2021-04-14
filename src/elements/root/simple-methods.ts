import { ElementTag } from "../element-tag";
import { ValidChildren } from "../../types";

export class SimpleMethods extends ElementTag {
    public static readonly TAG = "simple-methods";
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
            `public class ${this.converter.getClassName()} {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }
}
