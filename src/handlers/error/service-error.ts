import { BaseErrorHandler } from "./base-error";

export class ServiceErrorHandler extends BaseErrorHandler {
    public returnError(value: string) {
        this.converter.addImport("ServiceUtil");
        return [`return ServiceUtil.returnError(${value});`];
    }
}
