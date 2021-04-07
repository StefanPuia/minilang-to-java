import { XMLSchemaElementAttributes } from "../../types";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class FieldToList extends SetterElement {
    protected attributes = this.attributes as FieldToListAttributes;

    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
        return this.attributes.list;
    }
    public convert(): string[] {
        return [
            ...this.createListIfNotExists(),
            `${this.attributes.list}.add(${this.attributes.field})`,
        ];
    }

    private createListIfNotExists(): string[] {
        if (!this.declared) {
            this.converter.addImport("List");
            this.converter.addImport("ArrayList");
            const variable = this.getVariableFromContext(this.attributes.field);
            const paramType = variable?.type ? `<${variable?.type}>` : "";
            return [`List${paramType} ${this.getField()} = new ArrayList<>();`];
        }
        return [];
    }
}

interface FieldToListAttributes extends BaseSetterAttributes {
    list: string;
}
