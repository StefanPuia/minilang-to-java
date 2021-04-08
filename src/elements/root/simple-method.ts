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
        this.addDefaultVariablesToContext();
        const children = this.convertChildren();
        return [
            `${this.getMethodHeader()} ${this.getThrows()}{`,
            ...[...this.getVariables(), ...children, ...this.getReturn()].map(
                this.prependIndentationMapper
            ),
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
                this.addVarToContext("request", "HttpServletRequest", true);
                this.addVarToContext("response", "HttpServletResponse", true);
                return `public String ${name}(final HttpServletRequest request, final HttpServletResponse response)`;

            case MethodMode.SERVICE:
                this.addVarToContext("dctx", "DispatchContext", true);
                this.addVarToContext("context", "Map", true, [
                    "String",
                    "Object",
                ]);
                return `public Map<String, Object> ${name}(final DispatchContext dctx, final Map<String, Object> context)`;
        }
        return `public void ${name}()`;
    }

    private addDefaultVariablesToContext() {
        this.addVarToContext("dispatcher", "LocalDispatcher");
        this.addVarToContext("delegator", "Delegator");
        this.addVarToContext("parameters", "Map", false, ["String", "Object"]);
        this.addVarToContext("userLogin", "GenericValue");
        this.addVarToContext("locale", "Locale");
        if (this.converter.getMethodMode() === MethodMode.SERVICE) {
            this.addVarToContext("_returnMap", "Map");
        }
    }

    private getVariables(): string[] {
        return [
            ...this.converter
                .getContextVariableHandler()
                .getDelegator(this.getVariableContext()),
            ...this.converter
                .getContextVariableHandler()
                .getDispatcher(this.getVariableContext()),
            ...this.converter
                .getContextVariableHandler()
                .getParameters(this.getVariableContext()),
            ...this.converter
                .getContextVariableHandler()
                .getUserLogin(this.getVariableContext()),
            ...this.converter
                .getContextVariableHandler()
                .getLocale(this.getVariableContext()),
            ...this.converter
                .getContextVariableHandler()
                .getReturnMap(this.getVariableContext()),
        ];
    }

    private getReturn(): string[] {
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                return [`return "success";`];

            case MethodMode.SERVICE:
                if (this.variableContext["_returnMap"]?.count > 0) {
                    return [`return _returnMap;`];
                }
                this.converter.addImport("ServiceUtil");
                return ["return ServiceUtil.returnSuccess();"];
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
        addImport: boolean = false,
        typeParams: string[] = []
    ) {
        if (addImport) {
            this.converter.addImport(type);
        }
        this.variableContext[name] = {
            name,
            type,
            typeParams,
            count: 0,
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
