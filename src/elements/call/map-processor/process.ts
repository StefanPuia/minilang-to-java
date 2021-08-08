import { MapProcessorBehaviour } from "../../../behavior/map-processor";
import { ProcessBehaviour } from "../../../behavior/process";
import { ValidationMap } from "../../../core/validate";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class Process extends ElementTag implements MapProcessorBehaviour {
    public static readonly TAG = "process";
    protected attributes = this.attributes as ProcessAttributes;

    public getValidation(): ValidationMap {
        return {
            childElements: [
                "validate-method",
                "compare",
                "compare-field",
                "regexp",
                "not-empty",
                "copy",
                "convert",
            ],
        };
    }

    public isProcessBehaviour(tag: any): tag is ProcessBehaviour {
        return "convertProcessOperation" in tag;
    }

    public convert(): string[] {
        const {
            field,
            "!mapName": mapName,
            "!errorListName": errorListName,
        } = this.attributes;
        return this.parseChildren()
            .filter(this.isProcessBehaviour)
            .map((tag) => (tag as any).convertProcessOperation(mapName, field, errorListName))
            .flat();
    }

    public convertProcessor(mapName: string, errorListName: string): string[] {
        return this.getInstance<ProcessAttributes>(Process, {
            "field": this.attributes.field,
            "!mapName": mapName,
            "!errorListName": errorListName,
        }).convert();
    }
}

interface ProcessAttributes extends XMLSchemaElementAttributes {
    "field": string;
    "!mapName"?: string;
    "!errorListName"?: string;
}
