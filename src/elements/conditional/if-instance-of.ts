import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfInstanceOf extends ConditionalElement {
    protected attributes = this.attributes as IfInstanceOfAttributes;

    protected convertCondition(): string {
        this.converter.addImport(this.attributes.class);
        const clazz = ConvertUtils.unqualify(this.attributes.class);
        return `${this.attributes.field} instanceof ${clazz}`;
    }
}
interface IfInstanceOfAttributes extends XMLSchemaElementAttributes {
    field: string;
    class: string;
}
