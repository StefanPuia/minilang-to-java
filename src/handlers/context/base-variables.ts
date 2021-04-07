import { Converter } from "../../core/converter";
import { VariableContext } from "../../types";

export class BaseVariableHandler {
    protected readonly converter: Converter;

    constructor(converter: Converter) {
        this.converter = converter;
    }

    protected getDelegatorSource(): string[] {
        return [];
    }

    protected getDispatcherSource(): string[] {
        return [];
    }

    protected getParametersSource(): string[] {
        return [];
    }

    protected getUserLoginSource(): string[] {
        return [];
    }

    protected getLocaleSource(): string[] {
        return [];
    }

    public getDelegator(context: VariableContext): string[] {
        if (context["delegator"]?.count > 0) {
            return this.getDelegatorSource();
        }
        return [];
    }

    public getDispatcher(context: VariableContext): string[] {
        if (context["dispatcher"]?.count > 0) {
            return this.getDispatcherSource();
        }
        return [];
    }

    public getParameters(context: VariableContext): string[] {
        if (context["parameters"]?.count > 0) {
            return this.getParametersSource();
        }
        return [];
    }

    public getUserLogin(context: VariableContext): string[] {
        if (context["userLogin"]?.count > 0) {
            return this.getUserLoginSource();
        }
        return [];
    }

    public getLocale(context: VariableContext): string[] {
        if (context["locale"]?.count > 0) {
            return this.getLocaleSource();
        }
        return [];
    }
}
