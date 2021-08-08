import { ProcessBehaviour } from "../../../behavior/process";
import { ValidationMap } from "../../../core/validate";
import { StringBoolean, XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class Copy extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "copy";
    protected attributes = this.attributes as CopyRawAttributes;

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["replace", "set-if-null"],
        };
    }

    private getAttributes(): CopyAttributes {
        return {
            field: this.attributes["!field"],
            toField: this.attributes["to-field"] ?? this.attributes["!field"],
            mapName: this.attributes["!mapName"],
            errorList: this.attributes["!errorList"],
            replace: this.attributes["replace"] !== "false",
            setIfNull: this.attributes["set-if-null"] !== "false",
        };
    }

    public convert(): string[] {
        const { mapName, field, toField } = this.getAttributes();
        const fieldValue = `${mapName}.get("${field}")`;
        return [
            `${mapName}.put("${toField}", ${this.converter.parseValue(
                fieldValue
            )})`,
        ];
    }

    public convertProcessOperation(
        mapName: string,
        fieldName: string,
        errorListName: string
    ): string[] {
        return this.getInstance<CopyRawAttributes>(Copy, {
            ...this.attributes,
            "!mapName": mapName,
            "!field": fieldName,
            "!errorList": errorListName,
        }).convert();
    }
}

interface CopyRawAttributes extends XMLSchemaElementAttributes {
    "to-field"?: string;
    "replace"?: StringBoolean;
    "set-if-null"?: StringBoolean;
    "!field": string;
    "!mapName": string;
    "!errorList": string;
}

interface CopyAttributes {
    toField: string;
    replace: boolean;
    setIfNull: boolean;
    field: string;
    mapName: string;
    errorList: string;
}
