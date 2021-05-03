import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "./setter";

export class FirstFromList extends SetterElement {
    public static readonly TAG = "first-from-list";
    protected attributes = this.attributes as FirstFromListRawAttributes;

    private getAttributes(): FirstFromListAttributes {
        return {
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        this.converter.appendMessage(
            "WARNING",
            "<first-from-list> element is deprecated (use <set>)",
            this.position
        );
        return {
            attributeNames: ["entry", "list"],
            requiredAttributes: ["entry", "list"],
            expressionAttributes: ["entry", "list"],
            noChildElements: true,
        };
    }

    public getType(): string | undefined {
        return (
            this.getVariableFromContext(this.getAttributes().list)
                ?.typeParams[0] ?? "Object"
        );
    }
    public getField(): string | undefined {
        return this.getAttributes().entry;
    }

    public convert(): string[] {
        this.converter.addImport("UtilValidate");
        return this.wrapConvert(
            `UtilValidate.isEmpty(${this.getField()}) ? null : ${
                this.getAttributes().list
            }.get(0)`
        );
    }
}

interface FirstFromListRawAttributes extends XMLSchemaElementAttributes {
    entry: string;
    list: string;
}

interface FirstFromListAttributes extends XMLSchemaElementAttributes {
    entry: FlexibleMapAccessor;
    list: FlexibleMapAccessor;
}
