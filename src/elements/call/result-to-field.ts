import { XMLSchemaElementAttributes } from "../../types";
import { ResultTo } from "./result-to";

export class ResultToField extends ResultTo {
    protected attributes = this.attributes as ResultToFieldAttributes;

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map";
    }
    public getField(): string | undefined {
        return this.attributes.field ?? this.getResultAttribute();
    }
    public convert(): string[] {
        return this.wrapConvert("null");
    }
    public getResultAttribute() {
        return this.attributes["result-name"];
    }
}

interface ResultToFieldAttributes extends XMLSchemaElementAttributes {
    "result-name": string;
    field?: string;
}
