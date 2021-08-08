import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    MethodMode,
} from "../../types";
import { ElementTag } from "../element-tag";
import { SetElement } from "./set";
import { BaseSetterRawAttributes } from "./setter";

export class RequestToField extends ElementTag {
    public static readonly TAG = "request-to-field";
    protected attributes = this.attributes as RequestToFieldRawAttributes;

    private getAttributes(): RequestToFieldAttributes {
        return {
            "request-name": this.attributes.field,
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "request-name", "default"],
            requiredAttributes: ["field"],
            expressionAttributes: ["field"],
            noChildElements: true,
        };
    }

    public getType(): string {
        return this.converter.guessFieldType(this.getField()) ?? "Object";
    }

    public getField(): string {
        return this.getAttributes().field;
    }

    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            const message = `"${this.getTagName()}" used outside of event environment. Line will be ignored.`;
            this.converter.appendMessage("ERROR", message, this.position);
            return [`// ${message}`];
        }
        this.setVariableToContext({ name: "request" });
        return SetElement.getInstance({
            converter: this.converter,
            parent: this.parent,
            field: this.getField(),
            from: `request.getAttribute("${this.getRequestName()}")`,
            setIfEmpty: !!this.getAttributes().default,
            defaultValue: this.getAttributes().default,
            type: this.getType(),
        }).convert();
    }

    private getRequestName() {
        return this.getAttributes()["request-name"];
    }
}

interface RequestToFieldRawAttributes extends BaseSetterRawAttributes {
    "request-name"?: string;
    "default"?: string;
}

interface RequestToFieldAttributes {
    "field": FlexibleMapAccessor;
    "request-name": FlexibleStringExpander;
    "default"?: FlexibleStringExpander;
}
