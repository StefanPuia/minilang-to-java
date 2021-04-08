import { BaseVariableHandler } from "./base-variables";
import { VariableContext } from "../../types";

export class ServiceVariableHandler extends BaseVariableHandler {
    protected getDelegatorSource(): string[] {
        this.converter.addImport("Delegator");
        return [`Delegator delegator = dctx.getDelegator();`];
    }
    protected getDispatcherSource(): string[] {
        this.converter.addImport("LocalDispatcher");
        return [`LocalDispatcher dispatcher = dctx.getDispatcher();`];
    }
    protected getParametersSource(): string[] {
        this.converter.addImport("Map");
        this.converter.addImport("HashMap");
        return [`Map<String, Object> parameters = new HashMap<>(context);`];
    }
    protected getUserLoginSource(): string[] {
        this.converter.addImport("GenericValue");
        return [
            `GenericValue userLogin = (GenericValue) context.get("userLogin");`,
        ];
    }
    protected getLocaleSource(): string[] {
        this.converter.addImport("Locale");
        return [
            `Locale locale = (Locale) context.get("locale");`,
        ];
    }
    protected getReturnMapSource(): string[] {
        this.converter.addImport("Map");
        this.converter.addImport("ServiceUtil");
        return [
            `Map<String, Object> _returnMap = ServiceUtil.returnSuccess();`,
        ];
    }
}
