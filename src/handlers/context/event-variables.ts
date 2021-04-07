import { BaseVariableHandler } from "./base-variables";
import { VariableContext } from "../../types";

export class EventVariableHandler extends BaseVariableHandler {
    protected getDelegatorSource(): string[] {
        this.converter.addImport("Delegator");
        return [
            `Delegator delegator = (Delegator) request.getAttribute("delegator");`,
        ];
    }
    protected getDispatcherSource(): string[] {
        this.converter.addImport("LocalDispatcher");
        return [
            `LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");`,
        ];
    }
    protected getParametersSource(): string[] {
        this.converter.addImport("Map");
        return [`Map<String, Object> parameters = request.getParametersMap();`];
    }
    protected getUserLoginSource(): string[] {
        this.converter.addImport("GenericValue");
        return [
            `GenericValue userLogin = (GenericValue) request.getSession().getAttribute("userLogin");`,
        ];
    }
}
