import ConvertUtils from "../../core/utils/convert-utils";
import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class FieldMap extends ElementTag {
    public static readonly TAG = "field-map";
    protected attributes = this.attributes as FieldMapAttributes;

    public convert(): string[] {
        this.converter.addImport("UtilMisc");
        return [`UtilMisc.toMap(${this.convertOnlyValues()})`];
    }

    public convertOnlyValues() {
        return `"${this.attributes["field-name"]}", ${this.getValue()}`;
    }

    private getValue() {
        return this.getFromField() ?? this.getFromValue();
    }

    private getFromField() {
        return ConvertUtils.parseFieldGetter(this.attributes["from-field"]);
    }

    private getFromValue() {
        return this.converter.parseValue(this.attributes.value ?? "");
    }
}

interface FieldMapAttributes extends XMLSchemaElementAttributes {
    "field-name": string;
    "from-field"?: string;
    "value"?: string;
}
