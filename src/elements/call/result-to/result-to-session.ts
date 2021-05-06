import ConvertUtils from "../../../core/convert-utils";
import { MethodMode, XMLSchemaElementAttributes } from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToSession extends ResultTo {
    public static readonly TAG = "result-to-session";
    protected attributes = this.attributes as ResultToSessionAttributes;

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
            `request.getSession().setAttribute("${
                this.attributes["session-name"] ?? this.getResultAttribute()
            }", ${assign});`,
        ];
    }
    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToSessionAttributes>(ResultToSession, {
            ...this.attributes,
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToSessionAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "session-name"?: string;
    "!from-field"?: string;
}
