import { BaseSetterAttributes, SetterElement } from "./setter";
import { StringBoolean } from "../../types";
export class PropertyToField extends SetterElement {
    protected attributes = this.attributes as PropertyToFieldAttributes;

    public getType(): string | undefined {
        return "String";
    }
    public getField(): string | undefined {
        return this.attributes.field;
    }
    public convert(): string[] {
        this.converter.addImport("EntityUtilProperties");
        this.setVariableToContext({ name: "delegator" });
        return this.wrapConvert(
            `EntityUtilProperties.getPropertyValue(${this.getParameters()})`
        );
    }

    private getParameters(): string {
        const { resource, property, default: defaultValue } = this.attributes;
        return [
            `"${resource}"`,
            `"${property}"`,
            `${(defaultValue && `"${defaultValue}"`) || ""}`,
            "delegator",
        ]
            .filter(Boolean)
            .join(", ");
    }
}

interface PropertyToFieldAttributes extends BaseSetterAttributes {
    resource: string;
    property: string;
    default?: string;
    "no-locale"?: StringBoolean;
    "arg-list"?: string;
    "arg-list-name"?: string;
}
