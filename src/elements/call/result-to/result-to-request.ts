import ConvertUtils from "../../../core/convert-utils";
import {
    FlexibleMapAccessor,
    FlexibleServletAccessor,
    MethodMode,
    XMLSchemaElementAttributes,
} from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToRequest extends ResultTo {
    public static readonly TAG = "result-to-request";
    protected attributes = this.attributes as ResultToRequestRawAttributes;
    private fromField = this.attributes["!from-field"];

    private getAttributes(): ResultToRequestAttributes {
        return {
            resultName: this.attributes["result-name"],
            requestName:
                this.attributes["request-name"] ??
                this.attributes["result-name"],
        };
    }

    public getResultAttribute(): string {
        return this.getAttributes().resultName;
    }

    public getType(): undefined {
        return;
    }
    public getField(): string {
        return this.getResultAttribute();
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
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            this.converter.appendMessage(
                "ERROR",
                `"${this.getTagName()}" used in a non-event environment`,
                this.position
            );
        }
        return [
            `request.setAttribute("${
                this.getAttributes().requestName
            }", ${assign});`,
        ];
    }
    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToRequestRawAttributes>(ResultToRequest, {
            ...{
                "result-name": this.getAttributes().resultName,
                "request-name": this.getAttributes().requestName,
            },
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToRequestRawAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "request-name"?: string;
    "!from-field"?: string;
}

interface ResultToRequestAttributes {
    resultName: FlexibleMapAccessor;
    requestName: FlexibleServletAccessor;
}
