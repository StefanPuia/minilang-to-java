import { ElementTag } from "../../elements/element-tag";
import { VariableContext, ContextVariable } from "../../types";
export class ContextUtils {
    public static setVariableToContext(
        variable: ContextVariable,
        context?: VariableContext
    ) {
        if (context) {
            if (context[variable.name]) {
                if (variable.count) {
                    context[variable.name].count = variable.count;
                }
                context[variable.name].count =
                    (context[variable.name].count ?? 0) + 1;
            } else {
                context[variable.name] = {
                    count: 1,
                    ...variable
                };
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
