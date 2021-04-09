import { BaseVariableHandler } from "./base-variables";

export class EventVariableHandler extends BaseVariableHandler {
    protected getDelegatorSource(): string[] {
        return [
            `Delegator delegator = (Delegator) request.getAttribute("delegator");`,
        ];
    }
    protected getDispatcherSource(): string[] {
        return [
            `LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");`,
        ];
    }
    protected getParametersSource(): string[] {
        return [`Map<String, Object> parameters = request.getParametersMap();`];
    }
    protected getUserLoginSource(): string[] {
        return [
            `GenericValue userLogin = (GenericValue) request.getSession().getAttribute("userLogin");`,
        ];
    }
    protected getDispatchContextSource(): string[] {
        return [`DispatchContext dctx = dispatcher.getDispatchContext();`];
    }
}
