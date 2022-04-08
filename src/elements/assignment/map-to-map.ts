import { ContextUtils } from "../../core/context-utils";
import ConvertUtils from "../../core/utils/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { SetElement } from "./set";
import { SetterElement } from "./setter";

export class MapToMap extends SetterElement {
    public static readonly TAG = "map-to-map";
    protected attributes = this.attributes as MapToMapAttributes;

    public getType(): string {
        return (
            ContextUtils.getFullType(this, this.attributes.map) ??
            "Map<String, Object>"
        );
    }
    public getField(): string | undefined {
        return (
            ConvertUtils.parseFieldGetter(this.attributes["to-map"]) ??
            this.attributes["to-map"]
        );
    }
    public convert(): string[] {
        return [
            ...this.getToMapDeclaration(),
            `${this.getField()}.putAll(${this.getFromMap()});`,
        ];
    }

    private getFromMap() {
        return (
            ConvertUtils.parseFieldGetter(this.attributes.map) ??
            this.attributes.map
        );
    }

    private getToMapDeclaration(): string[] {
        const toMap = this.getField();
        if (!toMap) {
            this.converter.appendMessage(
                "ERROR",
                `Cannot assign map values to environment.`,
                this.position
            );
            return [`// Cannot assign map values to environment.`];
        }
        const toMapExists = this.getVariableFromContext(toMap);
        if (toMapExists) {
            return SetElement.getInstance({
                converter: this.converter,
                parent: this.parent,
                field: toMap,
                value: "NewMap",
                type: this.getType(),
            }).convert();
        }
        return [];
    }
}

interface MapToMapAttributes extends XMLSchemaElementAttributes {
    "map": string;
    "to-map"?: string;
}
