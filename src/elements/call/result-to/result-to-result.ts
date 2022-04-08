import ConvertUtils from "../../../core/utils/convert-utils";
import {
    FlexibleMapAccessor,
    MethodMode,
    XMLSchemaElementAttributes,
} from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToResult extends ResultTo {
    public static readonly TAG = "result-to-result";
    protected attributes = this.attributes as ResultToResultRawAttributes;
    private fromField = this.attributes["!from-field"];

    private getAttributes(): ResultToResultAttributes {
        return {
            resultName: this.attributes["result-name"],
            serviceResultName:
                this.attributes["service-result-name"] ??
                this.attributes["result-name"],
        };
    }

    public getResultAttribute(): string {
        return this.getAttributes().resultName;
    }

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map";
    }
    public getField(): string | undefined {
        this.setVariableToContext({ name: this.converter.getReturnVariable() });
        return `${this.converter.getReturnVariable()}.${
            this.getAttributes().serviceResultName
        }`;
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

    public wrapConvert(assign: string): string[] {
        return [...super.wrapConvert(assign)];
    }

    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToResultRawAttributes>(ResultToResult, {
            ...{
                "result-name": this.getAttributes().resultName,
                "service-result-name": this.getAttributes().serviceResultName,
            },
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToResultRawAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "service-result-name"?: string;
    "!from-field"?: string;
}

interface ResultToResultAttributes {
    resultName: FlexibleMapAccessor;
    serviceResultName: FlexibleMapAccessor;
}
