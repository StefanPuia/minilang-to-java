import ConvertUtils from "../../core/utils/convert-utils";
import { unqualify } from "../../core/utils/import-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfInstanceOf extends ConditionalElement {
    public static readonly TAG = "if-instance-of";
    protected attributes = this.attributes as IfInstanceOfAttributes;

    protected convertCondition(): string {
        this.converter.addImport(this.attributes.class);
        const clazz = unqualify(this.attributes.class);
        return `${this.attributes.field} instanceof ${clazz}`;
    }
}
interface IfInstanceOfAttributes extends XMLSchemaElementAttributes {
    field: string;
    class: string;
}
