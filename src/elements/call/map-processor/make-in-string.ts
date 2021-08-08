import { MakeInStringBehaviour } from "../../../behavior/make-in-string";
import { MapProcessorBehaviour } from "../../../behavior/map-processor";
import { ValidationMap } from "../../../core/validate";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class MakeInString extends ElementTag implements MapProcessorBehaviour {
    public static readonly TAG = "make-in-string";
    protected attributes = this.attributes as MakeInStringAttributes;

    public getValidation(): ValidationMap {
        return {
            childElements: ["in-field", "property", "constant"],
        };
    }

    private isMakeInStringBehaviour(tag: any): tag is MakeInStringBehaviour {
        return "convertMakeInStringOperation" in tag;
    }

    public convert(): string[] {
        this.converter.addImport("StringBuilder");
        const { field, "!mapName": mapName } = this.attributes;
        const bufferName = `${field}Buffer`;
        return [
            `final StringBuilder ${bufferName} = new StringBuilder();`,
            ...this.parseChildren()
                .filter(this.isMakeInStringBehaviour)
                .map<string>((tag) =>
                    (tag as any).convertMakeInStringOperation(mapName, field)
                )
                .map((string) => `${bufferName}.append(${string});`)
                .flat(),
            `${mapName}.put("${field}", ${bufferName}.toString());`,
        ];
    }

    public convertProcessor(mapName: string): string[] {
        return this.getInstance<MakeInStringAttributes>(MakeInString, {
            "field": this.attributes.field,
            "!mapName": mapName,
        }).convert();
    }
}

interface MakeInStringAttributes extends XMLSchemaElementAttributes {
    "field": string;
    "!mapName"?: string;
}
