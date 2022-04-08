import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class RemoveRelated extends ElementTag {
    public static readonly TAG = "remove-related";
    protected attributes = this.attributes as RemoveRelatedAttributes;

    public convert(): string[] {
        const relationName = this.converter.parseValue(
            this.attributes["relation-name"]
        );
        const value =
            ConvertUtils.parseFieldGetter(this.attributes["value-field"]) ??
            this.attributes["value-field"];
        this.addException("GenericEntityException");
        this.setVariableToContext({ name: "delegator" });
        return [`delegator.removeRelated(${relationName}, ${value});`];
    }

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["do-cache-clear"],
        };
    }
}

interface RemoveRelatedAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "relation-name": string;
    "do-cache-clear"?: StringBoolean;
}
