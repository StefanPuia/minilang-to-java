import { MethodMode } from "../../types";
import { ElementTag } from "../element-tag";
import { Set } from "./set";
import { BaseSetterAttributes } from "./setter";

export class SessionToField extends ElementTag {
    public static readonly TAG = "session-to-field";
    protected attributes = this.attributes as SessionToFieldAttributes;

    private getAttrName() {
        return this.attributes["session-name"] ?? this.attributes.field;
    }

    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            const message = `"session-to-field" used outside of event environment. Line will be ignored.`;
            this.converter.appendMessage("WARNING", message, this.position);
            // TODO: don't ignore some fields? (userLogin)
            return [`// ${message}`];
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
