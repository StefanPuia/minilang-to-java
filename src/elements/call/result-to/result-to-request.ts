import ConvertUtils from "../../../core/convert-utils";
import { MethodMode, XMLSchemaElementAttributes } from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToRequest extends ResultTo {
    public static readonly TAG = "result-to-request";
    protected attributes = this.attributes as ResultToRequestAttributes;

    public getResultAttribute(): string | undefined {
        return this.attributes["result-name"];
    }

    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
        return this.attributes["result-name"];
    }

    public convert(): string[] {
        return this.wrapConvert(
            `${
                (this.attributes["!from-field"] &&
                    ConvertUtils.parseFieldGetter(
                        `${
                            this.attributes["!from-field"]
                        }.${this.getResultAttribute()}`
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
                this.attributes["request-name"] ?? this.getResultAttribute()
            }", ${assign});`,
        ];
    }
    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToRequestAttributes>(ResultToRequest, {
            ...this.attributes,
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToRequestAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "request-name"?: string;
    "!from-field"?: string;
}
