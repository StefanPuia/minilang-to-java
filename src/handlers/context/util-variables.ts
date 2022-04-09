import { BaseVariableHandler } from "./base-variables";
import { ContextVariable } from "./variables/context-variable";
import { Delegator } from "./variables/delegator";
import { Dispatcher } from "./variables/dispatcher";
import { Locale } from "./variables/locale";
import { Parameters } from "./variables/parameters";
import { ReturnMap } from "./variables/return-map";
import { TimeZone } from "./variables/time-zone";
import { UserLogin } from "./variables/user-login";

export class UtilVariableHandler extends BaseVariableHandler {
    public getVariables(): ContextVariable[] {
        this.converter.addImport("HashMap");
        return [
            new Delegator(this.converter, this.context),
            new Dispatcher(this.converter, this.context),
            new Parameters(this.converter, this.context),
            new UserLogin(this.converter, this.context),
            new Locale(this.converter, this.context),
            new TimeZone(this.converter, this.context),
            new ReturnMap(this.converter, this.context, `new HashMap<>()`),
        ];
    }
}
