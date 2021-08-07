import { ElementTag } from "../element-tag";

export class SimpleMethods extends ElementTag {
    public static readonly TAG = "simple-methods";

    public convert(): string[] {
        return [
            `public class ${this.converter.getClassName()} {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }
}
