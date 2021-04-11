import { ElementTag } from "../element-tag";

export class Else extends ElementTag {
    public static readonly TAG = "else";
    protected hasOwnContext(): boolean {
        return true;
    }

    public convert(): string[] {
        return [
            "} else {",
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    public getParentVariableContext() {
        return this.parent?.getParent()?.getVariableContext();
    }
}
