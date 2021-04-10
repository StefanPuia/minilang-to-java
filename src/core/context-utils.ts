import { ElementTag } from "../elements/element-tag";
import { VariableContext, ContextVariable } from "../types";
export class ContextUtils {
    public static setVariableToContext(
        variable: ContextVariable,
        context?: VariableContext
    ) {
        if (context) {
            if (context[variable.name]) {
                context[variable.name].count++;
            } else {
                context[variable.name] = variable;
            }
        }
    }

    public static getFullType(
        self: ElementTag,
        variable?: string
    ): string | undefined {
        if (!variable) return;
        const contextVar = self?.getVariableFromContext(variable);
        if (!contextVar) return;
        const { type, typeParams } = contextVar;
        return `${type}${
            typeParams.length ? `<${typeParams.join(", ")}>` : ""
        }`;
    }
}
