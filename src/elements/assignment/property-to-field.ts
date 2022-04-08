import { BaseSetterRawAttributes, SetterElement } from "./setter";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    StringBoolean,
} from "../../types";
import { ValidationMap } from "../../core/validate";
import ConvertUtils from "../../core/utils/convert-utils";

export class PropertyToField extends SetterElement {
    public static readonly TAG = "property-to-field";
    protected attributes = this.attributes as PropertyToFieldRawAttributes;

    private getAttributes(): PropertyToFieldAttributes {
        const {
            field,
            property,
            resource,
            default: defaultValue,
        } = this.attributes;

        return {
            "arg-list": (this.attributes["arg-list"] ??
                this.attributes["arg-list-name"]) as FlexibleMapAccessor,
            "no-locale": this.attributes["no-locale"] === "true",
            field,
            property,
            resource,
            "default": defaultValue,
        };
    }

    public getValidation(): ValidationMap {
        return {
            deprecatedAttributes: [
                {
                    name: "arg-list-name",
                    fixInstruction: `replace with "arg-list"`,
                },
            ],
            attributeNames: [
                "field",
                "resource",
                "property",
                "arg-list",
                "default",
                "no-locale",
            ],
            requiredAttributes: ["field", "resource", "property"],
            expressionAttributes: ["field", "arg-list"],
            noChildElements: true,
        };
    }

    public getType(): string | undefined {
        return "String";
    }
    public getField(): string | undefined {
        return this.getAttributes().field;
    }
    public convert(): string[] {
        this.converter.addImport("EntityUtilProperties");
        this.setVariableToContext({ name: "delegator" });

        const propertyVar = ConvertUtils.validVariableName(
            `${this.getAttributes().resource}_${this.getAttributes().property}`
        );
        return [
            `final String ${propertyVar} = ${this.getPropertyValue()};`,
            ...this.wrapConvert(this.wrapMessageFormat(propertyVar)),
        ];
    }

    private getPropertyValue(): string {
        const {
            resource,
            property,
            "no-locale": noLocale,
            "default": defaultValue,
        } = this.getAttributes();

        if (noLocale) {
            const params = [
                `"${resource}"`,
                `"${property}"`,
                defaultValue ? this.converter.parseValue(defaultValue) : "",
                "delegator",
            ]
                .filter(Boolean)
                .join(", ");
            return `EntityUtilProperties.getPropertyValue(${params})`;
        } else {
            this.setVariableToContext({ name: "locale" });
            const value = `EntityUtilProperties.getMessage("${resource}", "${property}", locale, delegator)`;
            if (defaultValue) {
                this.converter.addImport("Optional");
                return `Optional.ofNullable(${value}).orElse(${this.converter.parseValue(
                    defaultValue
                )})`;
            }
            return value;
        }
    }

    private wrapMessageFormat(value: string): string {
        const argList = this.getAttributes()["arg-list"];
        if (argList) {
            this.converter.addImport("MessageFormat");
            return `MessageFormat.format(${value}, ${ConvertUtils.parseFieldGetter(
                argList
            )}.toArray())`;
        }
        return value;
    }
}

interface PropertyToFieldRawAttributes extends BaseSetterRawAttributes {
    "resource": string;
    "property": string;
    "default"?: string;
    "no-locale"?: StringBoolean;
    "arg-list"?: string;
    "arg-list-name"?: string;
}

interface PropertyToFieldAttributes {
    "field": FlexibleMapAccessor;
    "resource": FlexibleStringExpander;
    "property": FlexibleStringExpander;
    "default"?: FlexibleStringExpander;
    "no-locale": boolean;
    "arg-list": FlexibleMapAccessor;
}
