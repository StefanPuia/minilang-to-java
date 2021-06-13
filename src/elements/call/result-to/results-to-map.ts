import { XMLSchemaElementAttributes } from "../../../types";
import { ResultTo } from "./result-to";

export class ResultToMap extends ResultTo {
    public static readonly TAG = "results-to-map";
    protected attributes = this.attributes as ResultToMapRawAttributes;
    private fromField = this.attributes["!from-field"];

    private getAttributes(): ResultToMapAttributes {
        return {
            mapName: this.attributes["map-name"],
        };
    }

    public getResultAttribute(): string | undefined {
        return;
    }

    public getType(): string {
        this.converter.addImport("Map");
        return "Map<String, Object>";
    }

    public getField(): string {
        return this.getAttributes().mapName;
    }

    public convert(): string[] {
        this.converter.addImport("HashMap");
        return this.wrapConvert(`new HashMap<>(${this.fromField ?? ""})`);
    }

    public ofServiceCall(resultName: string): string[] {
        return this.getInstance<ResultToMapRawAttributes>(ResultToMap, {
            ...{
                "map-name": this.getAttributes().mapName,
            },
            "!from-field": resultName,
        }).convert();
    }
}

interface ResultToMapRawAttributes extends XMLSchemaElementAttributes {
    "map-name": string;
    "!from-field"?: string;
}

interface ResultToMapAttributes {
    mapName: string;
}
