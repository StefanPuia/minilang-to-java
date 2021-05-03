import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class FieldToList extends SetterElement {
    public static readonly TAG = "field-to-list";
    protected attributes = this.attributes as FieldToListRawAttributes;

    private getAttributes(): FieldToListAttributes {
        return {
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        this.converter.appendMessage(
            "WARNING",
            "<field-to-list> element is deprecated (use <set>)",
            this.position
        );
        return {
            attributeNames: ["field", "list"],
            requiredAttributes: ["field", "list"],
            expressionAttributes: ["field", "list"],
            noChildElements: true,
        };
    }

    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
        return this.getAttributes().list;
    }
    public convert(): string[] {
        return [
            ...this.createListIfNotExists(),
            `${this.getAttributes().list}.add(${this.getAttributes().field});`,
        ];
    }

    private createListIfNotExists(): string[] {
        if (!this.declared) {
            this.converter.addImport("List");
            this.converter.addImport("ArrayList");
            const variable = this.getVariableFromContext(
                this.getAttributes().field
            );
            const paramType = variable?.type ? `<${variable?.type}>` : "";
            this.setVariableToContext({
                name: this.getAttributes().list,
                type: variable?.type ?? "List",
                count: 1,
                typeParams: variable?.typeParams ?? [],
            });
            return [`List${paramType} ${this.getField()} = new ArrayList<>();`];
        }
        return [];
    }
}

interface FieldToListRawAttributes extends BaseSetterRawAttributes {
    list: string;
}

interface FieldToListAttributes {
    field: FlexibleMapAccessor;
    list: FlexibleMapAccessor;
}
