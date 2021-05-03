import { ValidationMap } from "../../core/validate";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class ClearField extends SetterElement {
    public static readonly TAG = "clear-field";
    protected attributes = this.attributes as BaseSetterRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field"],
            requireAnyAttribute: ["field"],
            expressionAttributes: ["field"],
            noChildElements: true,
        };
    }

    public getType() {
        return `Object`;
    }
    public getField(): string {
        return this.attributes.field;
    }
    public convert(): string[] {
        const contextVar = this.getVariableFromContext(this.attributes.field);
        if (contextVar?.type === "Map") {
            return this.wrapConvert(this.converter.parseValue("NewMap"));
        }
        if (contextVar?.type === "List") {
            return this.wrapConvert(this.converter.parseValue("NewList"));
        }
        return this.wrapConvert("null");
    }
}
