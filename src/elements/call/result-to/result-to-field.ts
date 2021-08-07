import ConvertUtils from "../../../core/convert-utils";
import {
    FlexibleMapAccessor,
    XMLSchemaElementAttributes,
} from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToField extends ResultTo {
    public static readonly TAG = "result-to-field";
    protected attributes = this.attributes as ResultToFieldRawAttributes;
    private fromField?: string = this.attributes["!from-field"];

    private getAttributes(): ResultToFieldAttributes {
        return {
            resultName: this.attributes["result-name"],
            field: this.attributes.field ?? this.attributes["result-name"],
        };
    }

    public getType(): string {
        return this.converter.guessFieldType(this.getField()) ?? "Object";
    }
    public getField(): string {
        return this.getAttributes().field ?? this.getResultAttribute();
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
        return this.getAttributes().resultName;
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
        return this.getInstance<ResultToFieldRawAttributes>(ResultToField, {
            ...{
                "field": this.getAttributes().field,
                "result-name": this.getAttributes().resultName,
            },
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToFieldRawAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "field"?: string;
    "!from-field"?: string;
}

interface ResultToFieldAttributes {
    field: FlexibleMapAccessor;
    resultName: FlexibleMapAccessor;
}
