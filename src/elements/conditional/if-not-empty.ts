import ConvertUtils from "../../core/utils/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfNotEmpty extends ConditionalElement {
    public static readonly TAG = "if-not-empty";
    protected attributes = this.attributes as IfNotEmptyAttributes;

    protected convertCondition(): string {
        this.converter.addImport("UtilValidate");
        return `UtilValidate.isNotEmpty(${ConvertUtils.parseFieldGetter(
            this.attributes.field
        )})`;
    }
}

interface IfNotEmptyAttributes extends XMLSchemaElementAttributes {
    field: string;
}
