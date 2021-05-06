import { XMLSchemaElementAttributes } from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToMap extends ResultTo {
    public static readonly TAG = "result-to-map";
    protected attributes = this.attributes as ResultToMapAttributes;

    public getResultAttribute(): string | undefined {
        return;
    }

    public getType(): string {
        this.converter.addImport("Map");
        return "Map<String, Object>";
    }

    public getField(): string {
        return this.attributes["map-name"];
    }

    public convert(): string[] {
        this.converter.addImport("HashMap");
        return this.wrapConvert(
            `new HashMap<>(${this.attributes["!from-field"] ?? ""})`
        );
    }

    public ofServiceCall(resultName: string): string[] {
        this.attributes["!from-field"] = resultName;
        return this.convert();
    }
}

interface ResultToMapAttributes extends XMLSchemaElementAttributes {
    "map-name": string;
    "!from-field"?: string;
}
