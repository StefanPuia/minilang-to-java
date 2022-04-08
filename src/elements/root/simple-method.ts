import { DEFAULT_TYPE } from "../../consts";
import { ValidationMap } from "../../core/validate";
import {
    MethodMode,
    StringBoolean,
    VariableContext,
    XMLSchemaElementAttributes,
} from "../../types";
import { ElementTag } from "../element-tag";

export class SimpleMethod extends ElementTag {
    public static readonly TAG = "simple-method";
    protected attributes: SimpleMethodRawAttributes = this.attributes;
    private exceptions: Set<string> = new Set();

    public getValidation(): ValidationMap {
        return {
            deprecatedAttributes: [
                "parameter-map-name",
                "locale-name",
                "delegator-name",
                "security-name",
                "dispatcher-name",
                "user-login-name",
            ],
            requiredAttributes: ["method-name"],
        };
    }

    private getAttributes(): SimpleMethodAttributes {
        const {
            "method-name": methodName,
            "short-description": shortDescription,
            "login-required": loginRequired,
            "use-transaction": useTransaction,
            "default-error-code": defaultErrorCode,
            "default-success-code": defaultSuccessCode,
            "event-request-object-name": eventRequestObjectName,
            "event-response-object-name": eventResponseObjectName,
            "event-session-object-name": eventSessionObjectName,
            "event-response-code-name": eventResponseCodeName,
            "event-error-message-name": eventErrorMessageName,
            "event-error-message-list-name": eventErrorMessageListName,
            "event-event-message-name": eventEventMessageName,
            "event-event-message-list-name": eventEventMessageListName,
            "service-response-message-name": serviceResponseMessageName,
            "service-error-message-name": serviceErrorMessageName,
            "service-error-message-list-name": serviceErrorMessageListName,
            "service-error-message-map-name": serviceErrorMessageMapName,
            "service-success-message-name": serviceSuccessMessageName,
            "service-success-message-list-name": serviceSuccessMessageListName,
        } = this.attributes;

        return {
            methodName,
            shortDescription: shortDescription ?? "",
            defaultErrorCode: defaultErrorCode ?? "error",
            defaultSuccessCode: defaultSuccessCode ?? "success",
            eventRequestName: eventRequestObjectName ?? "request",
            eventSessionName: eventSessionObjectName ?? "session",
            eventResponseName: eventResponseObjectName ?? "response",
            eventResponseCodeName: eventResponseCodeName ?? "_response_code_",
            eventErrorMessageName: eventErrorMessageName ?? "_error_message_",
            eventErrorMessageListName:
                eventErrorMessageListName ?? "_error_message_list_",
            eventEventMessageName: eventEventMessageName ?? "_event_message_",
            eventEventMessageListName:
                eventEventMessageListName ?? "_event_message_list_",
            serviceResponseMessageName:
                serviceResponseMessageName ?? "responseMessage",
            serviceErrorMessageName: serviceErrorMessageName ?? "errorMessage",
            serviceErrorMessageListName:
                serviceErrorMessageListName ?? "errorMessageList",
            serviceErrorMessageMapName:
                serviceErrorMessageMapName ?? "errorMessageMap",
            serviceSuccessMessageName:
                serviceSuccessMessageName ?? "successMessage",
            serviceSuccessMessageListName:
                serviceSuccessMessageListName ?? "successMessageList",
            loginRequired: loginRequired !== "false",
            useTransaction: useTransaction !== "false",
        };
    }

    public convert(): string[] {
        this.addDefaultVariablesToContext();
        const children = this.convertChildren();
        return [
            ...this.getDescription(),
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

    private getDescription() {
        return [`// ${this.getAttributes().shortDescription}`];
    }

    private getMethodHeader() {
        const name = this.getAttributes().methodName;
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                this.addVarToContext("request", "HttpServletRequest", true);
                this.addVarToContext("response", "HttpServletResponse", true);
                return `public String ${name}(final HttpServletRequest request, final HttpServletResponse response)`;

            case MethodMode.SERVICE:
                this.addVarToContext("dctx", "DispatchContext", true);
                this.addVarToContext("context", "Map", true, [
                    "String",
                    DEFAULT_TYPE,
                ]);
                return `public Map<String, Object> ${name}(final DispatchContext dctx, final Map<String, Object> context)`;
        }
        return `public void ${name}()`;
    }

    private addDefaultVariablesToContext() {
        this.addVarToContext("dispatcher", "LocalDispatcher");
        this.addVarToContext("delegator", "Delegator");
        this.addVarToContext("parameters", "Map", false, [
            "String",
            DEFAULT_TYPE,
        ]);
        this.addVarToContext("userLogin", "GenericValue");
        this.addVarToContext("locale", "Locale");
        this.addVarToContext("dctx", "DispatchContext");
        if (this.converter.getMethodMode() === MethodMode.SERVICE) {
            this.addVarToContext("_returnMap", "Map");
        }
    }

    private getVariables(): string[] {
        const context = this.getVariableContext() as VariableContext;
        return [
            ...this.converter.getContextVariableHandler().getDelegator(context),
            ...this.converter
                .getContextVariableHandler()
                .getDispatcher(context),
            ...this.converter
                .getContextVariableHandler()
                .getDispatchContext(context),
            ...this.converter
                .getContextVariableHandler()
                .getParameters(context),
            ...this.converter.getContextVariableHandler().getUserLogin(context),
            ...this.converter.getContextVariableHandler().getLocale(context),
            ...this.converter.getContextVariableHandler().getTimeZone(context),
            ...this.converter.getContextVariableHandler().getReturnMap(context),
        ];
    }

    private getReturn(): string[] {
        if (this.parseChildren().find((el) => el.getTagName() === "return")) {
            return [];
        }
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                return [`return "success";`];

            case MethodMode.SERVICE:
                if (
                    (this.getVariableFromContext("_returnMap")?.count ?? 0) > 0
                ) {
                    return [`return _returnMap;`];
                }
                this.converter.addImport("ServiceUtil");
                return ["return ServiceUtil.returnSuccess();"];
        }

        return [];
    }

    public getReturnError(message?: string, throwable?: string): string[] {
        const errorMessage = throwable
            ? `${throwable}.getMessage()`
            : `"${message}"`;
        switch (this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                return [
                    `request.setAttribute("_ERROR_MESSAGE_", ${errorMessage});`,
                    `return "error";`,
                ];

            case MethodMode.SERVICE:
                return [`return ServiceUtil.returnError(${errorMessage});`];
        }
        const params = [errorMessage, throwable].filter(Boolean);
        return [`throw new Exception(${params.join(", ")});`];
    }

    protected hasOwnContext() {
        return true;
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
        this.setVariableToContext({
            name,
            type,
            typeParams,
            count: 0,
        });
    }

    protected addException(exceptionClass: string) {
        this.converter.addImport(exceptionClass);
        this.exceptions.add(exceptionClass);
    }

    public getDefaultSuccessCode() {
        return this.getAttributes().defaultSuccessCode;
    }

    public getDefaultErrorCode() {
        return this.getAttributes().defaultErrorCode;
    }
}

interface SimpleMethodRawAttributes extends XMLSchemaElementAttributes {
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

interface SimpleMethodAttributes {
    methodName: string;
    shortDescription: string;
    defaultErrorCode: string;
    defaultSuccessCode: string;
    eventRequestName: string;
    eventSessionName: string;
    eventResponseName: string;
    eventResponseCodeName: string;
    eventErrorMessageName: string;
    eventErrorMessageListName: string;
    eventEventMessageName: string;
    eventEventMessageListName: string;
    serviceResponseMessageName: string;
    serviceErrorMessageName: string;
    serviceErrorMessageListName: string;
    serviceErrorMessageMapName: string;
    serviceSuccessMessageName: string;
    serviceSuccessMessageListName: string;
    loginRequired: boolean;
    useTransaction: boolean;
}
