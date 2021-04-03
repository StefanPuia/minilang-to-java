import { ElementTag } from "../../core/element-tag";
import { StringBoolean, ValidChildren, VariableContext, XMLSchemaElementAttributes } from "../../types";

export class SimpleMethod extends ElementTag {
    protected attributes: SimpleMethodAttributes = this.attributes;
    private variableContext: VariableContext = [];

    public getValidChildren(): ValidChildren {
        return {};
    }

    public convert(): string[] {
        return [
            `public void ${this.attributes["method-name"]}() {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    public getVariableContext() {
        return this.variableContext;
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
