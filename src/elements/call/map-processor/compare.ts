import { ProcessBehaviour } from "../../../behavior/process";
import ConvertUtils from "../../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class Compare extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "compare";
    protected attributes = this.attributes as CompareAttributes;

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
        const compareValue = this.converter.parseValue(this.attributes.value);
        return [
            `if (!${fieldValue}.equals(${compareValue})) {`,
            ...[
                `${errorListName}.add("Comparison failed for ${mapName}.${fieldName}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
    }
}

interface CompareAttributes extends XMLSchemaElementAttributes {
    value: string;
}
