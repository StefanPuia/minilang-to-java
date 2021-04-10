import { MethodMode } from "../../types";
import { ElementTag } from "../element-tag";
import { Set } from "./set";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class SessionToField extends ElementTag {
    protected attributes = this.attributes as SessionToFieldAttributes;

    private getAttrName() {
        return this.attributes["session-name"] ?? this.attributes.field;
    }

    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            this.converter.appendMessage(
                "WARNING",
                `"session-to-field" used outside of event environment. Line will be ignored.`
            );
            // TODO: don't ignore some fields? (userLogin)
            return [];
        }
        this.setVariableToContext({ name: "request" });
        return new Set(
            {
                type: "element",
                name: "set",
                attributes: {
                    "field": this.attributes.field,
                    "from-field": `request.getSession().getAttribute("${this.getAttrName()}")`,
                    "set-if-empty":
                        (this.attributes.default && "true") || "false",
                    "default-value": this.attributes.default,
                },
            },
            this.converter,
            this.parent
        ).convert();
    }
}

interface SessionToFieldAttributes extends BaseSetterAttributes {
    "session-name"?: string;
    "default"?: string;
}
