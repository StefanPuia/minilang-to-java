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
                    ...variable,
                };
            }
        }
    }

    public static getFullType(
        self: ElementTag,
        variable?: string
    ): string | undefined;
    public static getFullType(variable?: ContextVariable): string | undefined;
    public static getFullType(
        selfOrVarContext?: ElementTag | ContextVariable,
        variable?: string
    ): string | undefined {
        if (selfOrVarContext && !this.isContextVariable(selfOrVarContext)) {
            return this.getFullTypeForElement(selfOrVarContext, variable);
        }
        return this.getFullTypeForVarContext(selfOrVarContext);
    }

    private static isContextVariable(
        variable: unknown
    ): variable is ContextVariable {
        return Reflect.has(variable as object, "typeParams");
    }

    private static getFullTypeForVarContext(
        contextVar?: ContextVariable
    ): string | undefined {
        if (!contextVar) return;
        const { type, typeParams } = contextVar;
        return `${type}${
            typeParams.length ? `<${typeParams.join(", ")}>` : ""
        }`;
    }

    private static getFullTypeForElement(
        self: ElementTag,
        variable?: string
    ): string | undefined {
        if (!variable) return;
        const contextVar = self?.getVariableFromContext(variable);
        return this.getFullTypeForVarContext(contextVar);
    }
}
