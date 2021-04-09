import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfEmpty extends ConditionalElement {
    protected attributes = this.attributes as IfEmptyAttributes;

    public convert(): string[] {
        this.converter.addImport("UtilValidate");
        return [
            `if (UtilValidate.isEmpty(${ConvertUtils.parseFieldGetter(this.attributes.field)})) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            ...this.getElseBlock(),
        ];
    }
}

interface IfEmptyAttributes extends XMLSchemaElementAttributes {
    field: string;
}
