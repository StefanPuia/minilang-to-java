import { StringBoolean, XMLSchemaElementAttributes } from "../../../types";
import { PropertyInfo } from "../property-info/property-info";
import { ResultTo } from "../result-to";
import { AbstractCallService } from "./abstract-call-service";

export class CallService extends AbstractCallService {
    public static readonly TAG = "call-service";
    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map";
    }

    public getField(): string | undefined {
        return;
    }

    protected attributes = this.attributes as CallServiceAttributes;

    public convert(): string[] {
        // TODO: handle these
        // return [
        //     ...this.getAppendMessage("error-prefix"),
        //     ...this.getAppendMessage("error-suffix"),
        //     ...this.getAppendMessage("success-prefix"),
        //     ...this.getAppendMessage("success-suffix"),
        //     ...this.getAppendMessage("message-prefix"),
        //     ...this.getAppendMessage("message-suffix"),
        //     ...this.getAppendMessage("default-message"),
        // ];
        this.addException("GenericServiceException");
        this.setVariableToContext({ name: "dispatcher" });
        return [
            ...this.addUserLoginToMap(),
            ...this.wrapFieldDeclaration(
                `dispatcher.runSync(${this.getParameters().join(
                    ", "
                )})${this.getResultAttributeGetter()};`
            ),
        ];
    }

    private getAppendMessage(type: AppendedMessageType) {
        return this.parseChildren()
            .filter((tag) => tag instanceof PropertyInfo)
            .filter((tag) => tag.getTagName() === type)
            .map((tag) => tag.convert())
            .flat();
    }

    private wrapFieldDeclaration(serviceCall: string): string[] {
        return (
            (this.parseChildren().find(
                (el) => el instanceof ResultTo
            ) as ResultTo)?.wrapConvert(serviceCall, false) ?? [serviceCall]
        );
    }

    private getResultAttributeGetter() {
        const attribute = (this.parseChildren().find(
            (el) => el instanceof ResultTo
        ) as ResultTo)?.getResultAttribute();
        return attribute ? `.get("${attribute}")` : "";
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

interface CallServiceAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "in-map-name"?: string;
    "include-user-login"?: StringBoolean;
    "break-on-error": StringBoolean;
    "error-code"?: string;
    "success-code"?: string;
    "require-new-transaction"?: StringBoolean;
    "transaction-timeout"?: string;
}
