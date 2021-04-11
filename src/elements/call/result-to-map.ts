import { XMLSchemaElementAttributes } from "../../types";
import { ResultTo } from "./result-to";

export class ResultToMap extends ResultTo {
    public static readonly TAG = "result-to-map";
    protected attributes = this.attributes as ResultToMapAttributes;

    public getResultAttribute(): string | undefined {
        return;
    }

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map";
    }
    public getField(): string | undefined {
        return this.attributes["map-name"];
    }
    public convert(): string[] {
        return this.wrapConvert("null");
    }
}

interface ResultToMapAttributes extends XMLSchemaElementAttributes {
    "map-name": string;
}
