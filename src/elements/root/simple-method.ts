import { ElementTag } from "../../core/element-tag";
import { ContextVariable } from "../../types";
import { ContextUtils } from "../../core/context-utils";
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
    private exceptions: Set<string> = new Set();

    public getValidChildren(): ValidChildren {
        return {};
    }

    public convert(): string[] {
        const children = [
            ...this.getVariables(),
            ...this.convertChildren(),
            ...this.getReturn(),
        ]
        return [
            `${this.getMethodHeader()} ${this.getThrows()}{`,
            ...children.map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getThrows() {
        if (this.exceptions.size) {
            return `throws ${Array.from(this.exceptions).join(", ")} `;
        }
        return "";
    }

    private getMethodHeader() {
        const name = this.attributes["method-name"];
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                this.addVarToContext("request", "HttpServletRequest");
                this.addVarToContext("response", "HttpServletResponse");
                return `public String ${name}(final HttpServletRequest request, final HttpServletResponse response)`;

            case MethodMode.SERVICE:
                this.addVarToContext("dctx", "DispatchContext");
                this.addVarToContext("context", "Map", ["String", "Object"]);
                return `public Map<String, Object> ${name}(final DispatchContext dctx, final Map<String, Object> context)`;
        }
        return `public void ${name}()`;
    }

    private getVariables(): string[] {
        const addDelegatorDispatcherToContext = () => {
            this.addVarToContext("dispatcher", "LocalDispatcher");
            this.addVarToContext("delegator", "Delegator");
            this.addVarToContext("parameters", "Map", ["String", "Object"]);
        };
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                addDelegatorDispatcherToContext();
                return [
                    `LocalDispatcher dispatcher = (LocalDispatcher) request.getAttribute("dispatcher");`,
                    `Delegator delegator = (Delegator) request.getAttribute("delegator");`,
                    `Map<String, Object> parameters = request.getParameterMap();`,
                ];

            case MethodMode.SERVICE:
                addDelegatorDispatcherToContext();
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

    public setVariableToContext(variable: ContextVariable) {
        ContextUtils.setVariableToContext(variable, this.variableContext);
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

    protected addException(exceptionClass: string) {
        this.converter.addImport(exceptionClass);
        this.exceptions.add(exceptionClass);
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
