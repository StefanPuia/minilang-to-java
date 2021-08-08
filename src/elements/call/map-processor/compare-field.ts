import { ProcessBehaviour } from "../../../behavior/process";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class CompareField extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "compare-field";
    protected attributes = this.attributes as CompareFieldAttributes;

    public convert(): string[] {
        this.converter.appendMessage(
            "ERROR",
            "Method not implemented.",
            this.position
        );
        return [];
    }

    public convertProcessOperation(
        mapName: string,
        fieldName: string,
        errorListName: string
    ): string[] {
        const fieldValue = `${mapName}.get("${fieldName}")`;
        const compareValue = `${mapName}.get("${this.attributes.field}")`;
        return [
            `if (!${fieldValue}.equals(${compareValue})) {`,
            ...[
                `${errorListName}.add("Comparison failed for ${mapName}.${fieldName}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
    }
}

interface CompareFieldAttributes extends XMLSchemaElementAttributes {
    field: string;
}
