import { ProcessBehaviour } from "../../../behavior/process";
import ConvertUtils from "../../../core/utils/convert-utils";
import { unqualify } from "../../../core/utils/import-utils";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class ValidateMethod extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "validate-method";
    protected attributes = this.attributes as ValidateMethodAttributes;

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
        this.converter.addImport(this.attributes.class);
        const unqualified = unqualify(this.attributes.class);
        const fieldValue = `${mapName}.get("${fieldName}")`;
        return [
            `if (!${unqualified}.${this.attributes.method}(${fieldValue})) {`,
            ...[
                `${errorListName}.add("Validation failed for ${mapName}.${fieldName}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
    }
}

interface ValidateMethodAttributes extends XMLSchemaElementAttributes {
    method: string;
    class: string;
}
