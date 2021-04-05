import { Converter } from "../../core/converter";

export class BaseErrorHandler {
    protected readonly converter: Converter;

    constructor(converter: Converter) {
        this.converter = converter;
    }

    public returnError(value: string) {
        return [`throw new Exception(${value});`];
    }
}
