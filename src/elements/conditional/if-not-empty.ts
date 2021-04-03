import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionElement } from "./condition";

export class IfNotEmpty extends ConditionElement {
    protected attributes = this.attributes as IfNotEmptyAttributes;

    public convert(): string[] {
        this.converter.addImport("UtilValidate");
        return [
            `if (UtilValidate.isNotEmpty(${ConvertUtils.parseFieldGetter(this.attributes.field)})) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            ...this.getElseBlock(),
        ];
    }
}

interface IfNotEmptyAttributes extends XMLSchemaElementAttributes {
    field: string;
}
