import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { LoopingElement } from "./looping";

export class IterateMap extends LoopingElement {
    public static readonly TAG = "iterate-map";
    protected attributes = this.attributes as IterateMapRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["key", "map", "value"],
            requiredAttributes: ["key", "map", "value"],
            expressionAttributes: ["key", "map", "value"],
        };
    }

    private getAttributes(): IterateMapAttributes {
        return {
            ...this.attributes,
        };
    }

    public convert(): string[] {
        this.converter.addImport("Map");
        return [
            `for (Map.Entry<${this.getMapTypes().join(
                ", "
            )}> ${this.getEntryName()} : ${
                this.getAttributes().map
            }.entrySet()) {`,
            ...this.getKeyValAssignments().map(this.prependIndentationMapper),
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getMapTypes(): string[] {
        return (
            this.getVariableFromContext(this.getAttributes().map)
                ?.typeParams || ["Object", "Object"]
        );
    }

    private getEntryName(): string {
        return `${ConvertUtils.validVariableName(
            this.getAttributes().map
        )}Entry`;
    }

    private getKeyValAssignments(): string[] {
        const [keyType, valueType] = this.getMapTypes();
        const entryName = this.getEntryName();
        const { key: keyName, value: valueName } = this.getAttributes();
        return [
            `final ${keyType} ${keyName} = ${entryName}.getKey();`,
            `final ${valueType} ${valueName} = ${entryName}.getValue();`,
        ];
    }
}

interface IterateMapRawAttributes extends XMLSchemaElementAttributes {
    key: string;
    map: string;
    value: string;
}

interface IterateMapAttributes {
    key: FlexibleMapAccessor;
    map: FlexibleMapAccessor;
    value: FlexibleMapAccessor;
}
