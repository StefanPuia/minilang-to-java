import ConvertUtils from "../../../core/convert-utils";
import { Operator } from "../../../types";
import { IfComparing, IfComparingAttributes } from "./if-comparing";

export class IfCompareField extends IfComparing {
    public static readonly TAG = "if-compare-field";
    protected attributes = this.attributes as IfCompareFieldAttributes;

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

interface IfCompareFieldAttributes extends IfComparingAttributes {
    "operator": Operator;
    "to-field": string;
    "format"?: string;
}
