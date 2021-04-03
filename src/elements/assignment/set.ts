import ConvertUtils from "../../core/convert-utils";
import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "./setter";

export class Set extends SetterElement {
    protected attributes = this.attributes as SetAttributes;

    public convert(): string[] {
        return this.wrapIfConditions([this.wrapConvert(this.getWrappedAssigned())]);
    }

    private getConditions() {
        if (this.attributes["set-if-empty"] === "true") {
            this.converter.addImport("UtilValidate");
        }
        return [
            this.attributes["set-if-empty"] === "true" &&
                `UtilValidate.isEmpty(${this.attributes.field})`,
            this.attributes["set-if-null"] === "true" && `${this.attributes.field} == null`,
        ]
            .filter(Boolean)
            .join(" || ");
    }

    private wrapIfConditions(nested: string[]) {
        const condition = this.getConditions();
        if (condition) {
            return [`if (${condition}) {`, ...nested.map(this.prependIndentationMapper), `}`];
        }
        return nested;
    }

    protected getType() {
        return this.attributes.type ?? "Object";
    }

    private getDefault() {
        return this.attributes.default ?? this.attributes["default-value"];
    }

    private getAssigned() {
        const from = ConvertUtils.parseFieldGetter(
            this.attributes.from ?? this.attributes["from-field"]
        );
        const value = this.attributes.value;

        if (from && value) {
            return `${from} ? ${from} : "${ConvertUtils.parseValue(value)}"`;
        }
        return from ?? ConvertUtils.parseValue(value ?? "");
    }

    private getWrappedAssigned() {
        const defaultVal = this.getDefault();
        const assigned = this.getAssigned();

        if (defaultVal) {
            this.converter.addImport("UtilValidate");
            return `UtilValidate.isNotEmpty(${assigned}) ? ${assigned} : ${defaultVal}`;
        }
        return assigned;
    }

    protected getUnsupportedAttributes() {
        return ["format"];
    }
}

interface SetAttributes extends XMLSchemaElementAttributes {
    field: string;
    from?: string;
    "from-field"?: string;
    value?: string;
    default?: string;
    "default-value"?: string;
    type?: string;
    format?: string;
    "set-if-null": StringBoolean;
    "set-if-empty": StringBoolean;
}
