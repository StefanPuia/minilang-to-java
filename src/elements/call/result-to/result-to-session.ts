import ConvertUtils from "../../../core/convert-utils";
import {
    FlexibleMapAccessor,
    FlexibleServletAccessor,
    MethodMode,
    XMLSchemaElementAttributes,
} from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToSession extends ResultTo {
    public static readonly TAG = "result-to-session";
    protected attributes = this.attributes as ResultToSessionRawAttributes;
    private fromField = this.attributes["!from-field"];

    private getAttributes(): ResultToSessionAttributes {
        return {
            resultName: this.attributes["result-name"],
            sessionName:
                this.attributes["session-name"] ??
                this.attributes["result-name"],
        };
    }

    public getResultAttribute(): string | undefined {
        return this.getAttributes().resultName;
    }

    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
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
            `request.getSession().setAttribute("${
                this.getAttributes().sessionName
            }", ${assign});`,
        ];
    }
    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToSessionRawAttributes>(ResultToSession, {
            ...{
                "result-name": this.getAttributes().resultName,
                "session-name": this.getAttributes().sessionName,
            },
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToSessionRawAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "session-name"?: string;
    "!from-field"?: string;
}

interface ResultToSessionAttributes {
    resultName: FlexibleMapAccessor;
    sessionName: FlexibleServletAccessor;
}
