import { ContextUtils } from "../../core/context-utils";
import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "./setter";

export class FilterListByDate extends SetterElement {
    public static readonly TAG = "filter-list-by-date";
    protected attributes = this.attributes as FilterListByDateAttributes;

    public getType(): string | undefined {
        return (
            ContextUtils.getFullType(this, this.attributes["to-list"]) ??
            ContextUtils.getFullType(this, this.attributes.list) ??
            "List"
        );
    }
    public getField(): string | undefined {
        return this.attributes["to-list"] ?? this.attributes.list;
    }
    public convert(): string[] {
        if (!this.attributes["valid-date"]) {
            this.converter.addImport("UtilDateTime");
        }
        this.converter.addImport("EntityUtil");
        return this.wrapConvert(`EntityUtil.filterByDate(${this.getParams()})`);
    }

    private getParams() {
        return [
            ConvertUtils.parseFieldGetter(this.attributes.list),
            ConvertUtils.parseFieldGetter(this.attributes["valid-date"]) ??
                `UtilDateTime.nowTimestamp()`,
            this.attributes["from-field-name"] ?? "fromDate",
            this.attributes["thru-field-name"] ?? "thruDate",
            "true",
        ]
            .filter(Boolean)
            .join(", ");
    }
}

interface FilterListByDateAttributes extends XMLSchemaElementAttributes {
    "list": string;
    "to-list"?: string;
    "valid-date"?: string;
    "from-field-name"?: string;
    "thru-field-name"?: string;
}
