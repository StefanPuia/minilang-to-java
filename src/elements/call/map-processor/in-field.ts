import { MakeInStringBehaviour } from "../../../behavior/make-in-string";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class InField extends ElementTag implements MakeInStringBehaviour {
    public static readonly TAG = "in-field";
    protected attributes = this.attributes as InFieldAttributes;

    public convert(): string[] {
        this.converter.appendMessage("ERROR", "Method not implemented.", this.position);
        return [];
    }

    public convertMakeInStringOperation(mapName: string, fieldName: string): string[] {
        return [
            `${mapName}.get("${this.attributes.field}")`
        ];
    }
}

interface InFieldAttributes extends XMLSchemaElementAttributes {
    field: string
}
