import ConvertUtils from "../../core/convert-utils";
import { MethodMode } from "../../types";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class RequestToField extends SetterElement {
    public static readonly TAG = "request-to-field";
    protected attributes = this.attributes as RequestToFieldAttributes;

    public getType(): string {
        return this.converter.guessFieldType(this.getField()) ?? "Object";
    }

    public getField(): string {
        return this.attributes.field;
    }

    public convert(): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            this.converter.appendMessage(
                "ERROR",
                `"${this.getTagName()}" used in a non-event environment`,
                this.position
            );
        }
        const value = `request.getAttribute("${this.getRequestName()}")`;
        if (this.attributes.default) {
            const defaultValue =
                ConvertUtils.parseFieldGetter(this.attributes.default) ??
                this.converter.parseValue(this.attributes.default);
            return this.wrapConvert(
                `${value} != null ? ${value} : ${defaultValue}`
            );
        }
        return this.wrapConvert(value);
    }

    private getRequestName() {
        return this.attributes["request-name"] ?? this.getField();
    }
}

interface RequestToFieldAttributes extends BaseSetterAttributes {
    "request-name"?: string;
    "default"?: string;
}
