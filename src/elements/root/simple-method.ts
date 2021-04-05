import { ElementTag } from "../../core/element-tag";
import { MethodMode, StringBoolean, ValidChildren, VariableContext, XMLSchemaElementAttributes } from "../../types";

export class SimpleMethod extends ElementTag {
    protected attributes: SimpleMethodAttributes = this.attributes;
    private variableContext: VariableContext = [];

    public getValidChildren(): ValidChildren {
        return {};
    }

    public convert(): string[] {
        return [
            this.getMethodHeader(),
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getMethodHeader() {
        const name = this.attributes["method-name"];
        switch(this.converter.getMethodMode()) {
            case MethodMode.EVENT:
                this.converter.addImport("HttpServletRequest");
                this.converter.addImport("HttpServletResponse");
                return `public String ${name}(final HttpServletRequest request, final HttpServletResponse response) {`;
            
            case MethodMode.SERVICE:
                this.converter.addImport("Map");
                this.converter.addImport("DispatchContext");
                return `public Map<String, Object> ${name}(final DispatchContext dctx, final Map<String, Object> context) {`;
        }
        return `public void ${name}() {`
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
