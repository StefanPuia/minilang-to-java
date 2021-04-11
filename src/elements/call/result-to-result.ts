import { MethodMode, XMLSchemaElementAttributes } from "../../types";
import { ResultTo } from "./result-to";

export class ResultToResult extends ResultTo {
    public static readonly TAG = "result-to-result";
    protected attributes = this.attributes as ResultToResultAttributes;

    public getResultAttribute(): string | undefined {
        return this.attributes["result-name"];
    }

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map";
    }
    public getField(): string | undefined {
        this.setVariableToContext({ name: this.converter.getReturnVariable() });
        return `${this.converter.getReturnVariable()}.${
            this.attributes["service-result-name"] ??
            this.attributes["result-name"]
        }`;
    }
    public convert(): string[] {
        return this.wrapConvert("null");
    }

    public wrapConvert(assign: string): string[] {
        if (
            ![MethodMode.SERVICE, MethodMode.EVENT].includes(
                this.converter.getMethodMode()
            )
        ) {
            this.converter.appendMessage(
                "ERROR",
                `"${this.getTagName()}" used in a non-service or non-event environment`
            );
        }

        return [...super.wrapConvert(assign)];
    }
}

interface ResultToResultAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    "service-result-name"?: string;
}
