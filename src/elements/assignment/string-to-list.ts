import { XMLSchemaElementAttributes } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class StringToList extends SetterElement {
    public static readonly TAG = "string-to-list";
    protected attributes = this.attributes as StringToListAttributes;

    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
        return this.attributes.list;
    }
    public convert(): string[] {
        return [
            ...this.createListIfNotExists(),
            `${this.attributes.list}.add(${this.converter.parseValue(
                this.attributes.string
            )});`,
        ];
    }

    private createListIfNotExists(): string[] {
        if (!this.declared) {
            this.converter.addImport("List");
            this.converter.addImport("ArrayList");
            const paramType = "String";
            this.setVariableToContext({
                name: this.attributes.list,
                type: "List<String>",
                count: 1,
                typeParams: ["String"],
            });
            return [`List${paramType} ${this.getField()} = new ArrayList<>();`];
        }
        return [];
    }

    protected getUnsupportedAttributes() {
        return ["arg-list", "message-field"];
    }
}

interface StringToListAttributes extends XMLSchemaElementAttributes {
    "string": string;
    "list": string;
    "arg-list"?: string;
    "message-field"?: string;
}
