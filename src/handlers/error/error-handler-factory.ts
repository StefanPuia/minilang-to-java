import { Converter } from "../../core/converter";
import { MethodMode } from "../../types";
import { BaseErrorHandler } from "./base-error";
import { EventErrorHandler } from "./event-error";
import { ServiceErrorHandler } from "./service-error";

export class ErrorHandlerFactory {
    public static getHandler(converter: Converter) {
        switch (converter.getMethodMode()) {
            case MethodMode.EVENT:
                return new EventErrorHandler(converter);
            case MethodMode.SERVICE:
                return new ServiceErrorHandler(converter);
            default:
                return new BaseErrorHandler(converter);
        }
    }
}
