import { ProcessBehaviour } from "../../../behavior/process";
import ConvertUtils from "../../../core/utils/convert-utils";
import { ValidationMap } from "../../../core/validate";
import { StringBoolean, XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class Convert extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "convert";
    protected attributes = this.attributes as ConvertRawAttributes;

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["replace", "set-if-null"],
        };
    }

    private getAttributes(): ConvertAttributes {
        return {
            field: this.attributes["!field"],
            toField: this.attributes["to-field"] ?? this.attributes["!field"],
            mapName: this.attributes["!mapName"],
            errorList: this.attributes["!errorList"],
            replace: this.attributes["replace"] !== "false",
            setIfNull: this.attributes["set-if-null"] !== "false",
            format: this.attributes.format,
            type: this.attributes.type,
        };
    }

    public convert(): string[] {
        const { mapName, field, toField, type, format } = this.getAttributes();
        const fieldValue = `${mapName}.get("${field}")`;
        const convertedVariable = ConvertUtils.validVariableName(
            `${toField}Converted`
        );
        this.setVariableToContext({ name: "locale" });
        this.converter.addImport("ObjectType");
        return [
            `final ${type} ${convertedVariable} = ` +
                `ObjectType.simpleTypeConvert(${fieldValue}, "${type}", "${format}", locale);`,
            `${mapName}.put("${toField}", ${convertedVariable})`,
        ];
    }

    public convertProcessOperation(
        mapName: string,
        fieldName: string,
        errorListName: string
    ): string[] {
        return this.getInstance<ConvertRawAttributes>(Convert, {
            ...this.attributes,
            "!mapName": mapName,
            "!field": fieldName,
            "!errorList": errorListName,
        }).convert();
    }
}

interface ConvertRawAttributes extends XMLSchemaElementAttributes {
    "to-field"?: string;
    "replace"?: StringBoolean;
    "set-if-null"?: StringBoolean;
    "type": string;
    "format": string;
    "!field": string;
    "!mapName": string;
    "!errorList": string;
}

interface ConvertAttributes {
    toField: string;
    replace: boolean;
    setIfNull: boolean;
    field: string;
    mapName: string;
    errorList: string;
    type: string;
    format: string;
}
