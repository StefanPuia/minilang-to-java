import { BaseVariableHandler } from "./base-variables";
import { VariableContext } from "../../types";

export class ServiceVariableHandler extends BaseVariableHandler {
    protected getDelegatorSource(): string[] {
        return [`Delegator delegator = dctx.getDelegator();`];
    }

    protected getDispatcherSource(): string[] {
        return [`LocalDispatcher dispatcher = dctx.getDispatcher();`];
    }

    protected getParametersSource(): string[] {
        this.converter.addImport("HashMap");
        return [`Map<String, Object> parameters = new HashMap<>(context);`];
    }

    protected getUserLoginSource(): string[] {
        return [
            `GenericValue userLogin = (GenericValue) context.get("userLogin");`,
        ];
    }

    protected getLocaleSource(): string[] {
        return [`Locale locale = (Locale) context.get("locale");`];
    }
    protected getTimeZoneSource(): string[] {
        return [`TimeZone timeZone = (TimeZone) context.get("timeZone");`];
    }

    protected getReturnMapSource(): string[] {
        this.converter.addImport("ServiceUtil");
        return [
            `Map<String, Object> _returnMap = ServiceUtil.returnSuccess();`,
        ];
    }

    protected getDispatchContextSource(): string[] {
        return [];
    }
}
