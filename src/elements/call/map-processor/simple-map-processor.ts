import { MapProcessorBehaviour } from "../../../behavior/map-processor";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class SimpleMapProcessor extends ElementTag {
    public static readonly TAG = "simple-map-processor";
    protected attributes = this.attributes as SimpleMapProcessorAttributes;

    private isMapProcessorBehaviour(tag: any): tag is MapProcessorBehaviour {
        return "convertProcessor" in tag;
    }

    public convert(): string[] {
        const children = this.parseChildren();
        const { "!mapName": mapName, "!errorListName": errorListName } =
            this.attributes;
        return children
            .filter(this.isMapProcessorBehaviour)
            .map((tag) => (tag as any).convertProcessor(mapName, errorListName))
            .flat();
    }

    public convertProcessor(mapName: string, errorListName: string): string[] {
        return this.getInstance<SimpleMapProcessorAttributes>(
            SimpleMapProcessor,
            {
                "name": this.attributes.name,
                "!mapName": mapName,
                "!errorListName": errorListName,
            }
        ).convert();
    }
}

interface SimpleMapProcessorAttributes extends XMLSchemaElementAttributes {
    "name": string;
    "!mapName"?: string;
    "!errorListName"?: string;
}
