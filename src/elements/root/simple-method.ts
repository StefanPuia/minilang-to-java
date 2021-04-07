import { ElementTag } from "../../core/element-tag";
import {
    MethodMode,
    StringBoolean,
    ValidChildren,
    VariableContext,
    XMLSchemaElementAttributes,
} from "../../types";

export class SimpleMethod extends ElementTag {
    protected attributes: SimpleMethodAttributes = this.attributes;
    private variableContext: VariableContext = {};

    public getValidChildren(): ValidChildren {
        return {};
    }

    public convert(): string[] {
        return [
            this.getMethodHeader(),
            ...this.getVariables().map(this.prependIndentationMapper),
            ...this.convertChildren().map(this.prependIndentationMapper),
            ...this.getReturn().map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getMethodHeader() {
        const name = this.attributes["method-name"];
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                this.addVarToContext("request", "HttpServletRequest");
                this.addVarToContext("response", "HttpServletResponse");
                return `public String ${name}(final HttpServletRequest request, final HttpServletResponse response) {`;

            case MethodMode.SERVICE:
                this.addVarToContext("dctx", "DispatchContext");
                this.addVarToContext("context", "Map", ["String", "Object"]);
                return `public Map<String, Object> ${name}(final DispatchContext dctx, final Map<String, Object> context) {`;
        }
        return `public void ${name}() {`;
    }

    private getVariables(): string[] {
        this.addVarToContext("dispatcher", "LocalDispatcher");
        this.addVarToContext("delegator", "Delegator");
        this.addVarToContext("parameters", "Map", ["String", "Object"]);
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                return [
                    `LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");`,
                    `Delegator delegator = (Delegator) request.getAttribute("delegator");`,
                    `Map<String, Object> parameters = request.getParameterMap();`,
                ];

            case MethodMode.SERVICE:
                return [
                    `LocalDispatcher dispatcher = dctx.getDispatcher();`,
                    `Delegator delegator = dctx.getDelegator();`,
                    `Map<String, Object> parameters = context;`,
                ];
        }
        return [];
    }

    private getReturn(): string[] {
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                return [`return "success";`];

            case MethodMode.SERVICE:
                if (this.variableContext["_returnMap"]) {
                    return [`return _returnMap;`];
                }
                return ["return null;"];
        }

        return [];
    }

    public getVariableContext() {
        return this.variableContext;
    }

    private addVarToContext(
        name: string,
        type: string,
        typeParams: string[] = []
    ) {
        this.converter.addImport(type);
        this.variableContext[name] = {
            name,
            type,
            typeParams,
            count: 1,
        };
    }
}

interface SimpleMethodAttributes extends XMLSchemaElementAttributes {
    "method-name": string;
    "short-description"?: string;
    "login-required"?: StringBoolean;
    "use-transaction"?: StringBoolean;
    "default-error-code"?: string;
    "default-success-code"?: string;
    "event-request-object-name"?: string;
    "event-response-object-name"?: string;
    "event-session-object-name"?: string;
    "event-response-code-name"?: string;
    "event-error-message-name"?: string;
    "event-error-message-list-name"?: string;
    "event-event-message-name"?: string;
    "event-event-message-list-name"?: string;
    "service-response-message-name"?: string;
    "service-error-message-name"?: string;
    "service-error-message-list-name"?: string;
    "service-error-message-map-name"?: string;
    "service-success-message-name"?: string;
    "service-success-message-list-name"?: string;
}
