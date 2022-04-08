import { DEFAULT_TYPE } from "../../../consts";
import ConvertUtils from "../../../core/utils/convert-utils";
import { isNotUndefined } from "../../../core/utils/validate-utils";
import {
    FlexibleMapAccessor,
    XMLSchemaElementAttributes,
} from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToField extends ResultTo {
    public static readonly TAG = "result-to-field";
    protected attributes = this.attributes as ResultToFieldRawAttributes;
    private fromField?: string = this.attributes["!from-field"];

    protected shouldSetVariableToContext(): boolean {
        return isNotUndefined(this.fromField);
    }

    private getAttributes(): ResultToFieldAttributes {
        return {
            resultName: this.attributes["result-name"],
            field: this.attributes.field ?? this.attributes["result-name"],
        };
    }

    public getType(): string {
        return this.converter.guessFieldType(this.getField()) ?? DEFAULT_TYPE;
    }
    public getField(): string {
        return this.getAttributes().field ?? this.getResultAttribute();
    }

    public setFromField(fromField: string) {
        this.fromField = fromField;
    }

    public convert(): string[] {
        return this.wrapConvert(
            `${this.getCast()}${
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

    private getCast() {
        const existingType =
            this.getVariableFromContext(this.getField())?.type ?? DEFAULT_TYPE;
        return ConvertUtils.cast(existingType, this.getType());
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
