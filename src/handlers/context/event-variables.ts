import { BaseVariableHandler } from "./base-variables";
import { ContextVariable } from "./variables/context-variable";
import { Delegator } from "./variables/delegator";
import { Dispatcher } from "./variables/dispatcher";
import { Locale } from "./variables/locale";
import { Parameters } from "./variables/parameters";
import { TimeZone } from "./variables/time-zone";
import { UserLogin } from "./variables/user-login";

export class EventVariableHandler extends BaseVariableHandler {
    public getVariables(): ContextVariable[] {
        return [
            new Delegator(
                this.converter,
                this.context,
                `(Delegator) request.getAttribute("delegator")`
            ),
            new Dispatcher(
                this.converter,
                this.context,
                `(LocalDispatcher) request.getAttribute("dispatcher")`
            ),
            new Parameters(
                this.converter,
                this.context,
                "request.getParametersMap()"
            ),
            new UserLogin(
                this.converter,
                this.context,
                `(GenericValue) request.getSession().getAttribute("userLogin")`
            ),
            new Locale(
                this.converter,
                this.context,
                `(Locale) request.getAttribute("locale")`
            ),
            new TimeZone(
                this.converter,
                this.context,
                `(TimeZone) request.getAttribute("timeZone")`
            ),
        ];
    }
}
