import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfEmpty extends ConditionalElement {
    public static readonly TAG = "if-empty";
    protected attributes = this.attributes as IfEmptyAttributes;

    protected convertCondition(): string {
        this.converter.addImport("UtilValidate");
        return `${this.getNegated()}UtilValidate.isEmpty(${ConvertUtils.parseFieldGetter(
            this.attributes.field
        )})`;
    }
}

interface IfEmptyAttributes extends XMLSchemaElementAttributes {
    field: string;
}
