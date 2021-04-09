import { IfCompare } from "./if-compare";
import { XMLSchemaElementAttributes, Operator } from "../../types";
import ConvertUtils from "../../core/convert-utils";
export class IfCompareField extends IfCompare {
    protected getValue() {
        const attributes = (this
            .attributes as unknown) as IfCompareFieldAttributes;
        return (
            this.converter.parseValueOrInitialize(
                this.getFieldType(),
                ConvertUtils.parseFieldGetter(attributes["to-field"])
            ) ??
            ConvertUtils.parseFieldGetter(attributes["to-field"]) ??
            attributes["to-field"]
        );
    }
}

interface IfCompareFieldAttributes extends XMLSchemaElementAttributes {
    field: string;
    operator: Operator;
    "to-field": string;
    type?: string;
    format?: string;
}
