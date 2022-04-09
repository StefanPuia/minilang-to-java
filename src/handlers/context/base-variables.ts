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

    protected getTimeZoneSource(): string[] {
        return [];
    }

    protected getReturnMapSource(): string[] {
        this.converter.addImport("Map");
        this.converter.addImport("HashMap");
        return [
            `Map<String, Object> _returnMap = new HashMap();`,
        ];;
    }

    protected getDispatchContextSource(): string[] {
        return [];
    }

    public getDelegator(context: VariableContext): string[] {
        if ((context["delegator"]?.count ?? 0) > 0) {
            this.converter.addImport("Delegator");
            return this.getDelegatorSource();
        }
        return [];
    }

    public getDispatcher(context: VariableContext): string[] {
        if ((context["dispatcher"]?.count ?? 0) > 0) {
            this.converter.addImport("LocalDispatcher");
            return this.getDispatcherSource();
        }
        return [];
    }

    public getParameters(context: VariableContext): string[] {
        if ((context["parameters"]?.count ?? 0) > 0) {
            this.converter.addImport("Map");
            return this.getParametersSource();
        }
        return [];
    }

    public getUserLogin(context: VariableContext): string[] {
        if ((context["userLogin"]?.count ?? 0) > 0) {
            this.converter.addImport("GenericValue");
            return this.getUserLoginSource();
        }
        return [];
    }

    public getLocale(context: VariableContext): string[] {
        if ((context["locale"]?.count ?? 0) > 0) {
            this.converter.addImport("Locale");
            return this.getLocaleSource();
        }
        return [];
    }

    public getTimeZone(context: VariableContext): string[] {
        if ((context["timeZone"]?.count ?? 0) > 0) {
            this.converter.addImport("TimeZone");
            return this.getTimeZoneSource();
        }
        return [];
    }

    public getReturnMap(context: VariableContext): string[] {
        if ((context["_returnMap"]?.count ?? 0) > 0) {
            this.converter.addImport("Map");
            return this.getReturnMapSource();
        }
        return [];
    }

    public getDispatchContext(context: VariableContext): string[] {
        if ((context["dctx"]?.count ?? 0) > 0) {
            this.converter.addImport("DispatchContext");
            return this.getDispatchContextSource();
        }
        return [];
    }
}
