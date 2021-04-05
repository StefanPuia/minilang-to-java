import { ElementTag } from "../../core/element-tag";
import { VariableContext } from "../../types";

export class Root extends ElementTag {
    private variableContext: VariableContext = {};

    public convert(): string[] {
        return this.convertChildren();
    }

    public getVariableContext() {
        return this.variableContext;
    }
}