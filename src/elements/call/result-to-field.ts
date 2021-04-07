import { XMLSchemaElementAttributes } from "../../types";
import { ResultTo } from "./result-to";

export class ResultToField extends ResultTo {
    protected attributes = this.attributes as ResultToFieldAttributes;

    public getType(): string {
        return this.converter.guessFieldType(this.getField()) ?? "Object";
    }
    public getField(): string {
        return this.attributes.field ?? this.getResultAttribute();
    }
    public convert(): string[] {
        return this.wrapConvert("null");
    }
    public getResultAttribute() {
        return this.attributes["result-name"];
    }
    public wrapConvert(assign: string, semicolon?: boolean): string[] {
        return super.wrapConvert(`(${this.getType()}) ${assign}`, semicolon);
    }
}

interface ResultToFieldAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    field?: string;
}
