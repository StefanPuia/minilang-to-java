import { VariableContext, ContextVariable } from '../types';
export class ContextUtils {
    public static setVariableToContext(variable: ContextVariable, context?: VariableContext) {
        if (context) {
            if (context[variable.name]) {
                context[variable.name].count++;
            } else {
                context[variable.name] = variable;
            }
        }
    }
}