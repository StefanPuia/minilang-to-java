import ConvertUtils from "../../../core/convert-utils";
import { ValidationMap } from "../../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleMessage,
    FlexibleStringExpander,
    StringBoolean,
    XMLSchemaElementAttributes,
} from "../../../types";
import { SimpleMethod } from "../../root/simple-method";
import { PropertyInfo } from "../property-info/property-info";
import { ResultTo } from "../result-to/result-to";
import { AbstractCallService } from "./abstract-call-service";

export class CallService extends AbstractCallService {
    public static readonly TAG = "call-service";
    protected attributes = this.attributes as CallServiceRawAttributes;

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map<String, Object>";
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: [
                "service-name",
                "in-map-name",
                "include-user-login",
                "break-on-error",
                "error-code",
                "require-new-transaction",
                "transaction-timeout",
                "success-code",
            ],
            constantAttributes: [
                "include-user-login",
                "break-on-error",
                "error-code",
                "require-new-transaction",
                "transaction-timeout",
                "success-code",
            ],
            expressionAttributes: ["service-name", "in-map-name"],
            requiredAttributes: ["service-name"],
            childElements: [
                "error-prefix",
                "error-suffix",
                "success-prefix",
                "success-suffix",
                "message-prefix",
                "message-suffix",
                "default-message",
                "results-to-map",
                "result-to-field",
                "result-to-request",
                "result-to-session",
                "result-to-result",
            ],
        };
    }

    private getAttributes(): CallServiceAttributes {
        const {
            "service-name": serviceName,
            "in-map-name": inMapName,
            "include-user-login": includeUserLogin,
            "break-on-error": breakOnError,
            "error-code": errorCode,
            "success-code": successCode,
            "require-new-transaction": requireNewTransaction,
            "transaction-timeout": transactionTimeout,
        } = this.attributes;
        return {
            serviceName,
            inMapName,
            includeUserLogin: includeUserLogin !== "false",
            breakOnError: breakOnError !== "false",
            requireNewTransaction: requireNewTransaction === "true",
            errorCode:
                errorCode ??
                (this.getParent(
                    "simple-method"
                ) as SimpleMethod).getDefaultErrorCode(),
            successCode:
                successCode ??
                (this.getParent(
                    "simple-method"
                ) as SimpleMethod).getDefaultSuccessCode(),
            transactionTimeout: parseInt(transactionTimeout ?? "-1"),
            errorPrefix:
                this.getPropertyInfo("error-prefix") ?? "service.error.prefix",
            errorSuffix:
                this.getPropertyInfo("error-suffix") ?? "service.error.suffix",
            successPrefix:
                this.getPropertyInfo("success-prefix") ??
                "service.success.prefix",
            successSuffix:
                this.getPropertyInfo("success-suffix") ??
                "service.success.suffix",
            messagePrefix:
                this.getPropertyInfo("message-prefix") ??
                "service.message.prefix",
            messageSuffix:
                this.getPropertyInfo("message-suffix") ??
                "service.message.suffix",
            defaultMessage:
                this.getPropertyInfo("default-message") ??
                "service.default.message",
        };
    }

    private getPropertyInfo(tag: string) {
        const propertyInfo = this.parseChildren().find(
            (el) => el.getTagName() === tag
        ) as PropertyInfo | undefined;
        return propertyInfo?.getMessage();
    }

    public getField(): string {
        return ConvertUtils.validVariableName(
            `${this.getAttributes().serviceName}Result`
        );
    }

    public convert(): string[] {
        this.addException("GenericServiceException");
        this.setVariableToContext({ name: "dispatcher" });
        return [
            ...this.addUserLoginToMap(),
            ...this.getServiceCall(),
            ...this.getResultMappings(),
        ];
    }

    private getServiceCall(): string[] {
        const serviceCall = `dispatcher.runSync(${this.getParameters().join(
            ", "
        )})`;
        if (this.getResultMappings().length) {
            return this.wrapConvert(serviceCall);
        }
        return [`${serviceCall};`];
    }

    private getResultMappings(): string[] {
        return (this.parseChildren().filter(
            (el) => el instanceof ResultTo
        ) as ResultTo[])
            .map((resultTo) => resultTo.ofServiceCall(this.getField()))
            .flat();
    }

    protected getUnsupportedAttributes() {
        return [
            "include-user-login",
            "break-on-error",
            "error-code",
            "success-code",
            "require-new-transaction",
            "transaction-timeout",
        ];
    }
}

type AppendedMessageType =
    | "error-prefix"
    | "error-suffix"
    | "success-prefix"
    | "success-suffix"
    | "message-prefix"
    | "message-suffix"
    | "default-message";

interface CallServiceRawAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "in-map-name"?: string;
    "include-user-login"?: StringBoolean;
    "break-on-error"?: StringBoolean;
    "error-code"?: string;
    "success-code"?: string;
    "require-new-transaction"?: StringBoolean;
    "transaction-timeout"?: string;
}

interface CallServiceAttributes {
    serviceName: FlexibleStringExpander;
    inMapName?: FlexibleMapAccessor;
    includeUserLogin: boolean;
    breakOnError: boolean;
    requireNewTransaction: boolean;
    errorCode?: string;
    successCode?: string;
    transactionTimeout: number;
    errorPrefix: FlexibleMessage;
    errorSuffix: FlexibleMessage;
    successPrefix: FlexibleMessage;
    successSuffix: FlexibleMessage;
    messagePrefix: FlexibleMessage;
    messageSuffix: FlexibleMessage;
    defaultMessage: FlexibleMessage;
}
