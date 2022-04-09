import { Converter } from "../../core/converter";
import { MethodMode, VariableContext } from "../../types";
import { EventVariableHandler } from "./event-variables";
import { ServiceVariableHandler } from "./service-variables";
import { UtilVariableHandler } from "./util-variables";

export class ContextVariableFactory {
    public static getHandler(context: VariableContext, converter: Converter) {
        switch (converter.getMethodMode()) {
            case MethodMode.EVENT:
                return new EventVariableHandler(context, converter);
            case MethodMode.SERVICE:
                return new ServiceVariableHandler(context, converter);
            case MethodMode.GENERIC:
                return new UtilVariableHandler(context, converter);
        }
    }
}
