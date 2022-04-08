import { ContextUtils } from "../../core/context-utils";
import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "./setter";

export class FilterListByDate extends SetterElement {
    public static readonly TAG = "filter-list-by-date";
    protected attributes = this.attributes as FilterListByDateRawAttributes;

    private getAttributes(): FilterListByDateAttributes {
        if (!this.attributes["valid-date"]) {
            this.converter.addImport("UtilDateTime");
        }
        return {
            "to-list": this.attributes.list,
            "from-field-name": "fromDate",
            "thru-field-name": "thruDate",
            "valid-date": "UtilDateTime.nowTimestamp()",
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: [
                "list",
                "to-list",
                "valid-date",
                "fromDate",
                "thruDate",
            ],
            requiredAttributes: ["list"],
            expressionAttributes: ["list", "to-list", "valid-date"],
            constantAttributes: ["fromDate", "thruDate"],
            noChildElements: true,
        };
    }

    public getType(): string | undefined {
        return (
            ContextUtils.getFullType(this, this.getAttributes()["to-list"]) ??
            "List<Object>"
        );
    }
    public getField(): string | undefined {
        return this.getAttributes()["to-list"];
    }
    public convert(): string[] {
        this.converter.addImport("EntityUtil");
        return this.wrapConvert(`EntityUtil.filterByDate(${this.getParams()})`);
    }

    private getParams() {
        return [
            ConvertUtils.parseFieldGetter(this.getAttributes().list),
            ConvertUtils.parseFieldGetter(this.getAttributes()["valid-date"]),
            this.getAttributes()["from-field-name"],
            this.getAttributes()["thru-field-name"],
            "true",
        ]
            .filter(Boolean)
            .join(", ");
    }
}

interface FilterListByDateRawAttributes extends XMLSchemaElementAttributes {
    "list": string;
    "to-list"?: string;
    "valid-date"?: string;
    "from-field-name"?: string;
    "thru-field-name"?: string;
}

interface FilterListByDateAttributes {
    "list": FlexibleMapAccessor;
    "to-list": FlexibleMapAccessor;
    "valid-date": FlexibleMapAccessor;
    "from-field-name": string;
    "thru-field-name": string;
}
