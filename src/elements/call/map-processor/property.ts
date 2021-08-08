import { MakeInStringBehaviour } from "../../../behavior/make-in-string";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class Property extends ElementTag implements MakeInStringBehaviour {
    public static readonly TAG = "property";
    protected attributes = this.attributes as PropertyAttributes;

    public convert(): string[] {
        this.converter.appendMessage(
            "ERROR",
            "Method not implemented.",
            this.position
        );
        return [];
    }

    public convertMakeInStringOperation(
        mapName: string,
        fieldName: string
    ): string[] {
        const { resource, property } = this.attributes;
        this.converter.addImport("EntityUtilProperties");
        this.setVariableToContext({ name: "locale" });
        this.setVariableToContext({ name: "delegator" });
        return [
            `EntityUtilProperties.getMessage("${resource}", "${property}", locale, delegator)`,
        ];
    }
}

interface PropertyAttributes extends XMLSchemaElementAttributes {
    resource: string;
    property: string;
}
