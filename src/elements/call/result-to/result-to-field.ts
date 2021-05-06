import ConvertUtils from "../../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToField extends ResultTo {
    public static readonly TAG = "result-to-field";
    protected attributes = this.attributes as ResultToFieldAttributes;
    private fromField?: string = this.attributes["!from-field"];

    public getType(): string {
        return this.converter.guessFieldType(this.getField()) ?? "Object";
    }
    public getField(): string {
        return this.attributes.field ?? this.getResultAttribute();
    }

    public setFromField(fromField: string) {
        this.fromField = fromField;
    }

    public convert(): string[] {
        return this.wrapConvert(
            `${
                (this.fromField &&
                    ConvertUtils.parseFieldGetter(
                        `${this.fromField}.${this.getResultAttribute()}`
                    )) ||
                "null"
            }`
        );
    }
    public getResultAttribute() {
        return this.attributes["result-name"];
    }
    public wrapConvert(assign: string, semicolon?: boolean): string[] {
        return super.wrapConvert(`${this.getCast()}${assign}`, semicolon);
    }

    private getCast() {
        if (!ConvertUtils.requiresCast(this.getField(), this.getType())) {
            return "";
        }
        return `(${this.getType()}) `;
    }
    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToFieldAttributes>(ResultToField, {
            ...this.attributes,
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToFieldAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "field"?: string;
    "!from-field"?: string;
}
