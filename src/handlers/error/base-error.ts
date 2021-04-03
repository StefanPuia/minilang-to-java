export class BaseErrorHandler {
    public returnError(value: string) {
        return [`throw new Exception(${value});`];
    }
}
