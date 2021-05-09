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
            unhandledAttributes: ["error-code", "success-code"],
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
            unhandledChildElements: [
                "error-prefix",
                "error-suffix",
                "success-prefix",
                "success-suffix",
                "message-prefix",
                "message-suffix",
                "default-message",
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
        const {
            inMapName,
            includeUserLogin,
            serviceName,
        } = this.getAttributes();
        const [addUserLoginToContext, contextMapName] = this.addUserLoginToMap(
            serviceName,
            includeUserLogin,
            inMapName
        );
        return this.wrapWithTryCatch([
            ...addUserLoginToContext,
            ...this.getServiceCallWithResultsTo(contextMapName),
        ]);
    }

    private wrapWithTryCatch(nested: string[]) {
        const { breakOnError } = this.getAttributes();
        if (breakOnError) {
            this.converter.addImport("GenericServiceException");
            return [
                "try {",
                ...nested.map(this.prependIndentationMapper),
                "} catch (GenericServiceException e) {",
                ...[
                    ...(this.getParent<SimpleMethod>(
                        "simple-method"
                    )?.getReturnError("break-on-error triggered", "e") ?? []),
                ].map(this.prependIndentationMapper),
                "}",
            ];
        }
        return nested;
    }

    private getServiceCallWithResultsTo(contextMap?: string): string[] {
        const serviceCall = `dispatcher.runSync(${this.getParameters(
            contextMap
        ).join(", ")})`;
        const resultMappings = this.getResultMappings();
        if (resultMappings.length) {
            return [...this.wrapConvert(serviceCall), ...resultMappings];
        }
        return [`${serviceCall};`];
    }

    private getParameters(contextMap?: string): string[] {
        const {
            serviceName,
            inMapName,
            requireNewTransaction,
            transactionTimeout,
        } = this.getAttributes();
        const parameters: string[] = [`"${serviceName}"`];
        if (contextMap || inMapName) {
            parameters.push(contextMap ?? (inMapName as string));
        } else {
            this.converter.addImport("HashMap");
            parameters.push("new HashMap<>()");
        }
        if (transactionTimeout) {
            parameters.push(
                `${transactionTimeout}`,
                `${requireNewTransaction}`
            );
        }
        return parameters;
    }

    private getResultMappings(): string[] {
        return (this.parseChildren().filter(
            (el) => el instanceof ResultTo
        ) as ResultTo[])
            .map((resultTo) => resultTo.ofServiceCall(this.getField()))
            .flat();
    }
}

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
    transactionTimeout?: number;
    errorPrefix: FlexibleMessage;
    errorSuffix: FlexibleMessage;
    successPrefix: FlexibleMessage;
    successSuffix: FlexibleMessage;
    messagePrefix: FlexibleMessage;
    messageSuffix: FlexibleMessage;
    defaultMessage: FlexibleMessage;
}
