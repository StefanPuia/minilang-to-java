import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    MethodMode,
} from "../../types";
import { ElementTag } from "../element-tag";
import { Set } from "./set";
import { BaseSetterRawAttributes } from "./setter";

export class SessionToField extends ElementTag {
    public static readonly TAG = "session-to-field";
    protected attributes = this.attributes as SessionToFieldRawAttributes;

    private getAttributes(): SessionToFieldAttributes {
        return {
            "session-name": this.attributes.field,
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "session-name", "default"],
            requiredAttributes: ["field"],
            expressionAttributes: ["field"],
            noChildElements: true,
        };
    }

    private getAttrName() {
        return this.getAttributes()["session-name"];
    }

    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            const message = `"${this.getTagName()}" used outside of event environment. Line will be ignored.`;
            this.converter.appendMessage("ERROR", message, this.position);
            return [`// ${message}`];
        }
        this.setVariableToContext({ name: "request" });
        return Set.getInstance({
            converter: this.converter,
            parent: this.parent,
            field: this.getAttributes().field,
            from: `request.getSession().getAttribute("${this.getAttrName()}")`,
            setIfEmpty: !!this.getAttributes().default,
            defaultValue: this.getAttributes().default,
            type: "String",
        }).convert();
    }
}

interface SessionToFieldRawAttributes extends BaseSetterRawAttributes {
    "session-name"?: string;
    "default"?: string;
}

interface SessionToFieldAttributes {
    "field": FlexibleMapAccessor;
    "session-name": FlexibleStringExpander;
    "default"?: FlexibleStringExpander;
}
