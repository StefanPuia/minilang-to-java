import ConvertUtils from "../../core/convert-utils";
import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class StringToList extends SetterElement {
    public static readonly TAG = "string-to-list";
    protected attributes = this.attributes as StringToListRawAttributes;

    public getValidation(): ValidationMap {
        this.converter.appendMessage(
            "DEPRECATE",
            "<string-to-list> element is deprecated (use <set>)",
            this.position
        );
        return {
            attributeNames: ["list", "arg-list", "string", "message-field"],
            requiredAttributes: ["list", "string"],
            expressionAttributes: ["list", "arg-list"],
            noChildElements: true,
        };
    }

    private getAttributes(): StringToListAttributes {
        const {
            string,
            list,
            "arg-list": argList,
            "message-field": messageField,
        } = this.attributes;
        return {
            string,
            list,
            argList,
            messageField,
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
            `${this.getAttributes().list}.add(${this.getValue()});`,
        ];
    }

    private createListIfNotExists(): string[] {
        if (!this.declared) {
            this.converter.addImport("List");
            this.converter.addImport("ArrayList");
            const paramType = "String";
            this.setVariableToContext({
                name: this.getAttributes().list,
                type: "List<String>",
                count: 1,
                typeParams: ["String"],
            });
            return [`List${paramType} ${this.getField()} = new ArrayList<>();`];
        }
        return [];
    }

    protected getUnsupportedAttributes() {
        return ["message-field"];
    }

    private getValue(): string {
        const { string, argList } = this.getAttributes();
        const stringVal = this.converter.parseValue(string);
        if (argList?.length) {
            this.converter.addImport("MessageFormat");
            return `MessageFormat.format(${stringVal}, ${ConvertUtils.parseFieldGetter(
                argList
            )}.toArray());`;
        }
        return stringVal;
    }
}

interface StringToListRawAttributes extends XMLSchemaElementAttributes {
    "string": string;
    "list": string;
    "arg-list"?: string;
    "message-field"?: string;
}

interface StringToListAttributes {
    string: FlexibleStringExpander;
    list: FlexibleMapAccessor;
    argList?: FlexibleMapAccessor;
    messageField?: string;
}
