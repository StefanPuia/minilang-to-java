import { Converter } from "../../core/converter";
import { MethodMode } from "../../types";
import { EventVariableHandler } from "./event-variables";
import { ServiceVariableHandler } from "./service-variables";
import { BaseVariableHandler } from "./base-variables";

export class ContextVariableFactory {
    public static getHandler(converter: Converter) {
        switch (converter.getMethodMode()) {
            case MethodMode.EVENT:
                return new EventVariableHandler(converter);
            case MethodMode.SERVICE:
                return new ServiceVariableHandler(converter);
            default:
                return new BaseVariableHandler(converter);
        }
    }
}
