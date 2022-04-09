import { DEFAULT_MAP_TYPE } from "../../consts";
import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { SetElement } from "../assignment/set";
import { SetterElement } from "../assignment/setter";

export class SetServiceFields extends SetterElement {
    public static readonly TAG = "set-service-fields";
    protected attributes = this.attributes as SetServiceFieldsRawAttributes;

    private getAttributes(): SetServiceFieldsAttributes {
        return {
            serviceName: this.attributes["service-name"],
            map: this.attributes.map,
            toMap: this.attributes["to-map"],
            mode: this.attributes.mode ?? "IN",
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["service-name", "map", "to-map", "mode"],
            requiredAttributes: ["service-name", "map", "to-map"],
            constantPlusExpressionAttributes: ["service-name"],
            expressionAttributes: ["map", "to-map"],
            constantAttributes: ["mode"],
            noChildElements: true,
            deprecatedAttributes: ["error-list-name"],
        };
    }

    public getType(): string {
        this.converter.addImport("Map");
        return DEFAULT_MAP_TYPE;
    }
    public getField(): string {
        return this.getAttributes().toMap;
    }

    private getErrorMessageListParameter() {
        return `${this.getAttributes().serviceName}ContextErrorMessages`;
    }

    public convert(): string[] {
        this.setVariableToContext({ name: "dctx" });
        const targetMap =
            ConvertUtils.parseFieldGetter(this.getField()) ?? this.getField();
        return [
            ...this.getErrorMessageListDeclaration(),
            ...this.wrapConvert(
                `dctx.getModelService("${
                    this.getAttributes().serviceName
                }").makeValid(${this.getParameters()})`
            ),
        ];
    }
    private getErrorMessageListDeclaration(): string[] {
        if (this.converter.config.replicateMinilang) {
            return SetElement.getErrorMessageListDeclaration(
                this.getErrorMessageListParameter(),
                this.converter,
                this.parent
            );
        }
        return [];
    }

    private getParameters(): string {
        this.setVariableToContext({ name: "locale" });
        this.setVariableToContext({ name: "timeZone" });
        const fromMap =
            ConvertUtils.parseFieldGetter(this.getAttributes().map) ??
            this.getAttributes().map;
        const mode = `"${this.getAttributes().mode}"`;
        if (!this.converter.config.replicateMinilang) {
            return [fromMap, mode].join(", ");
        }
        return [
            fromMap,
            mode,
            "true",
            this.getErrorMessageListParameter(),
            "timeZone",
            "locale",
        ].join(", ");
    }
}

interface SetServiceFieldsRawAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "map": string;
    "to-map": string;
    "mode"?: "IN" | "OUT";
    "error-list-name"?: string; // this element gets deleted in the autoCorrect method
}

interface SetServiceFieldsAttributes {
    serviceName: FlexibleStringExpander;
    map: FlexibleMapAccessor;
    toMap: FlexibleMapAccessor;
    mode: "IN" | "OUT";
}
