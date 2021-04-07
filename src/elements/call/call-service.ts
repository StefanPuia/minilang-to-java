import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { CallerElement } from "./caller";
import { PropertyInfo } from "./property-info";
import { ResultTo } from "./result-to";

export class CallService extends CallerElement {
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
        return this.wrapFieldDeclaration(
            `dispatcher.runSync(${this.getParameters().join(
                ", "
            )})${this.getResultAttributeGetter()}`
        );
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
            (this.parseChildren().find((el) => el instanceof ResultTo) as ResultTo)?.wrapConvert(
                serviceCall
            ) ?? [serviceCall]
        );
    }

    private getResultAttributeGetter() {
        const attribute = (this.parseChildren().find(
            (el) => el instanceof ResultTo
        ) as ResultTo)?.getResultAttribute();
        return attribute ? `.get("${attribute}")` : "";
    }

    private getParameters(): string[] {
        return [`"${this.attributes["service-name"]}"`, this.attributes["in-map-name"]].filter(
            Boolean
        ) as string[];
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

export interface CallServiceAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "in-map-name"?: string;
    "include-user-login": StringBoolean;
    "break-on-error": StringBoolean;
    "error-code"?: string;
    "success-code"?: string;
    "require-new-transaction": StringBoolean;
    "transaction-timeout"?: string;
}
