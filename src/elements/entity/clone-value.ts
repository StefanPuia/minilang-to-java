import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "../assignment/setter";

export class CloneValue extends SetterElement {
    public static readonly TAG = "clone-value";
    protected attributes = this.attributes as CloneValueRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["value-field", "new-value-field"],
            requiredAttributes: ["value-field", "new-value-field"],
            expressionAttributes: ["value-field", "new-value-field"],
            noChildElements: true,
        };
    }

    private getAttributes(): CloneValueAttributes {
        return {
            value: this.attributes["value-field"],
            newValue: this.attributes["new-value-field"],
        };
    }

    public getType(): string {
        this.converter.addImport("GenericValue");
        return "GenericValue";
    }

    public getField(): string {
        return this.getAttributes().newValue;
    }

    public convert(): string[] {
        this.converter.addImport("GenericValue");
        const { value } = this.getAttributes();
        const from = ConvertUtils.parseFieldGetter(value) ?? value;
        return this.wrapConvert(`GenericValue.create(${from})`);
    }
}

interface CloneValueRawAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "new-value-field": string;
}

interface CloneValueAttributes {
    value: FlexibleMapAccessor;
    newValue: FlexibleMapAccessor;
}
