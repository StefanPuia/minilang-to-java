import { ElementTag } from "../../core/element-tag";
import { ContextUtils } from "../../core/context-utils";
import { ContextVariable, VariableContext } from "../../types";

export class Else extends ElementTag {
    private variableContext: VariableContext = {};

    public getVariableContext() {
        return {
            ...this.parent?.getParent()?.getVariableContext(),
            ...this.variableContext,
        };
    }

    public getVariableFromContext(variable: string) {
        return this.getVariableContext()?.[variable];
    }

    public setVariableToContext(variable: ContextVariable) {
        if (this?.parent?.getParent()?.getVariableFromContext(variable.name)) {
            ContextUtils.setVariableToContext(
                variable,
                this.parent?.getVariableContext()
            );
        } else {
            ContextUtils.setVariableToContext(variable, this.variableContext);
        }
    }

    public convert(): string[] {
        return [
            "} else {",
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }
}
