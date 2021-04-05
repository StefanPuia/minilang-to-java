import { BaseErrorHandler } from "./base-error";

export class EventErrorHandler extends BaseErrorHandler {
    public returnError(value: string) {
        return [`request.setAttribute("_ERROR_MESSAGE_", ${value});`, `return "error";`];
    }
}
