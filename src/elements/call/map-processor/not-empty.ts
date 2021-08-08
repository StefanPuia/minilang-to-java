import { ProcessBehaviour } from "../../../behavior/process";
import { ElementTag } from "../../element-tag";

export class NotEmpty extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "not-empty";

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
        this.converter.addImport("UtilValidate");
        const fieldValue = `${mapName}.get("${fieldName}")`;
        return [
            `if (UtilValidate.isEmpty(${fieldValue})) {`,
            ...[
                `${errorListName}.add("Validation failed for ${mapName}.${fieldName}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
    }
}
