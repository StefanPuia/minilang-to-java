import ConvertUtils from "../../core/utils/convert-utils";
import { Converter } from "../../core/converter";
import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    StringBoolean,
    XMLSchemaElementAttributes,
} from "../../types";
import { Tag } from "../tag";
import { SetterElement } from "./setter";
import { DEFAULT_TYPE } from "../../consts";

export class SetElement extends SetterElement {
    public static readonly TAG = "set";
    protected attributes = this.attributes as SetRawAttributes;

    public getValidation(): ValidationMap {
        return {
            deprecatedAttributes: [
                { name: "from-field", fixInstruction: 'replace with "from"' },
                {
                    name: "default-value",
                    fixInstruction: 'replace with "default"',
                },
            ],
            unhandledAttributes: ["format"],
            attributeNames: [
                "field",
                "from-field",
                "from",
                "value",
                "default-value",
                "default",
                "format",
                "type",
                "set-if-null",
                "set-if-empty",
            ],
            requiredAttributes: ["field"],
            requireAnyAttribute: ["from-field", "from", "value"], // TODO: actual implementation works with default value only, as well
            constantPlusExpressionAttributes: ["value"],
            constantAttributes: ["type", "set-if-null", "set-if-empty"],
            expressionAttributes: ["field"],
            noChildElements: true,
        };
    }

    private getAttributes(): SetAttributes {
        const {
            field,
            type,
            "default": defaultVal,
            "default-value": defaultValue,
            format,
            "set-if-empty": setIfEmpty,
            "set-if-null": setIfNull,
            "from-field": fromField,
            from,
            value,
        } = this.attributes;

        const attributes = {
            field,
            from: fromField ?? (from as FlexibleMapAccessor),
            value: value,
            default: defaultValue ?? defaultVal,
            type,
            format,
            setIfNull: setIfNull === "true",
            setIfEmpty: setIfEmpty === "true",
        };
        if (!attributes.from && !attributes.value) {
            attributes.value = attributes.default;
            attributes.default = undefined;
        }
        return attributes;
    }

    public getField(): string {
        return this.getAttributes().field;
    }

    public convert(): string[] {
        return this.wrapIfConditions([
            ...this.wrapConvert(this.getWrappedAssigned()),
        ]);
    }

    private getConditions() {
        if (this.getAttributes().setIfEmpty) {
            this.converter.addImport("UtilValidate");
        }
        return [
            this.getAttributes().setIfEmpty &&
                `UtilValidate.isEmpty(${this.getAttributes().field})`,
            this.getAttributes().setIfNull &&
                `${
                    ConvertUtils.parseFieldGetter(this.getAttributes().field) ??
                    this.getAttributes().field
                } == null`,
        ]
            .filter(Boolean)
            .join(" || ");
    }

    private wrapIfConditions(nested: string[]) {
        const condition = this.getConditions();
        if (condition) {
            return [
                `if (${condition}) {`,
                ...nested.map(this.prependIndentationMapper),
                `}`,
            ];
        }
        return nested;
    }

    public getType() {
        const selfType =
            this.getAttributes().type ??
            this.converter.guessFieldType(
                this.getAttributes().field,
                this.getAttributes().value
            );
        if (selfType) {
            return selfType;
        }
        const from = ConvertUtils.parseFieldGetter(this.getAttributes().from);
        if (from) {
            const { mapName } = ConvertUtils.mapMatch(from);
            if (!mapName) {
                return this.getVariableFromContext(from)?.type ?? DEFAULT_TYPE;
            }
        }
        return DEFAULT_TYPE;
    }

    private getDefault() {
        return this.getAttributes().default;
    }

    private getAssigned() {
        const from = ConvertUtils.parseFieldGetter(this.getAttributes().from);
        const value = this.converter.parseValueOrInitialize(
            this.getBaseType().type,
            this.getAttributes().value
        );

        if (from) {
            const { mapName } = ConvertUtils.mapMatch(from);
            if (mapName) {
                this.setVariableToContext({
                    name: mapName,
                    type: this.getBaseType().type,
                });
            }
        }

        if (from && value) {
            return `${from} ? ${from} : ${value}`;
        }
        return from ?? value ?? "";
    }

    private getWrappedAssigned() {
        const defaultVal = this.getDefault();
        const assigned = this.getAssigned();

        if (defaultVal) {
            if (assigned) {
                this.converter.addImport("UtilValidate");
                return `UtilValidate.isNotEmpty(${assigned}) ? ${assigned} : ${this.converter.parseValue(
                    defaultVal
                )}`;
            } else {
                return this.converter.parseValue(defaultVal);
            }
        }
        return assigned;
    }

    public static getInstance({
        converter,
        parent,
        field,
        from,
        setIfEmpty,
        defaultValue,
        type,
        value,
    }: {
        converter: Converter;
        parent?: Tag;
        field: string;
        from?: string;
        setIfEmpty?: boolean;
        defaultValue?: string;
        type?: string;
        value?: string;
    }): SetElement {
        return new SetElement(
            {
                type: "element",
                name: "set",
                attributes: {
                    field,
                    from,
                    value,
                    "set-if-empty": (setIfEmpty && "true") || "false",
                    "default": defaultValue,
                    type,
                },
            },
            converter,
            parent
        );
    }

    public static getErrorMessageListDeclaration(
        field: string,
        converter: Converter,
        parent?: Tag,
        value: string = "NewList",
        type: string = "List<Object>"
    ) {
        return SetElement.getInstance({
            converter,
            parent,
            field,
            value,
            type,
        }).convert();
    }
}

interface SetRawAttributes extends XMLSchemaElementAttributes {
    "field": string;
    "from"?: string;
    "from-field"?: string;
    "value"?: string;
    "default"?: string;
    "default-value"?: string;
    "type"?: string;
    "format"?: string;
    "set-if-null": StringBoolean;
    "set-if-empty": StringBoolean;
}

interface SetAttributes {
    field: FlexibleMapAccessor;
    from: FlexibleMapAccessor;
    value?: FlexibleStringExpander;
    default?: FlexibleStringExpander;
    type?: string;
    format?: FlexibleStringExpander;
    setIfNull: boolean;
    setIfEmpty: boolean;
}
