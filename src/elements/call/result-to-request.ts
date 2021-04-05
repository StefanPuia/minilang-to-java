import { MethodMode, XMLSchemaElementAttributes } from "../../types";
import { ResultTo } from "./result-to";

export class ResultToRequest extends ResultTo {
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
        return this.wrapConvert("null");
    }

    public wrapConvert(assign: string): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            this.converter.appendMessage("ERROR", `"${this.getTagName()}" used in a non-event environment`);
        }
        return [
            `request.setAttribute("${
                this.attributes["request-name"] ?? this.getResultAttribute()
            }", ${assign});`,
        ];
    }
}

interface ResultToRequestAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "request-name"?: string;
}
