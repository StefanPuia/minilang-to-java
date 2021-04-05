import { MethodMode, XMLSchemaElementAttributes } from "../../types";
import { ResultTo } from "./result-to";

export class ResultToSession extends ResultTo {
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
        return this.wrapConvert("null");
    }

    public wrapConvert(assign: string): string[] {
        if (this.converter.getMethodMode() !== MethodMode.EVENT) {
            this.converter.appendMessage("ERROR", `"${this.getTagName()}" used in a non-event environment`);
        }
        return [
            `request.getSession().setAttribute("${
                this.attributes["session-name"] ?? this.getResultAttribute()
            }", ${assign});`,
        ];
    }
}

interface ResultToSessionAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "session-name"?: string;
}
