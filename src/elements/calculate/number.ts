import { ValidationMap } from "../../core/validate";
import {
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { ElementTag } from "../element-tag";

export class NumberElement extends ElementTag {
    public static readonly TAG = "number";
    protected attributes = this.attributes as NumberElementRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["value"],
            requiredAttributes: ["value"],
            noChildElements: true,
        };
    }

    private getAttributes(): NumberElementAttributes {
        return {
            ...this.attributes,
        };
    }

    public convert(): string[] {
        return [this.converter.parseValue(this.getAttributes().value)];
    }
}

interface NumberElementRawAttributes extends XMLSchemaElementAttributes {
    value: string;
}

interface NumberElementAttributes {
    value: FlexibleStringExpander;
}
