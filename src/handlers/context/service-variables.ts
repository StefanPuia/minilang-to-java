import { BaseVariableHandler } from "./base-variables";
import { ContextVariable } from "./variables/context-variable";
import { Delegator } from "./variables/delegator";
import { Dispatcher } from "./variables/dispatcher";
import { Locale } from "./variables/locale";
import { Parameters } from "./variables/parameters";
import { ReturnMap } from "./variables/return-map";
import { TimeZone } from "./variables/time-zone";
import { UserLogin } from "./variables/user-login";

export class ServiceVariableHandler extends BaseVariableHandler {
    public getVariables(): ContextVariable[] {
        return [
            new Delegator(this.converter, this.context, "dctx.getDelegator()"),
            new Dispatcher(
                this.converter,
                this.context,
                "dctx.getDispatcher()"
            ),
            new Parameters(
                this.converter,
                this.context,
                "new HashMap<>(context)"
            ),
            new UserLogin(
                this.converter,
                this.context,
                `(GenericValue) context.get("userLogin")`
            ),
            new Locale(
                this.converter,
                this.context,
                `(Locale) context.get("locale")`
            ),
            new TimeZone(
                this.converter,
                this.context,
                `(TimeZone) context.get("timeZone")`
            ),
            new ReturnMap(
                this.converter,
                this.context,
                `ServiceUtil.returnSuccess()`
            ),
        ];
    }
}
