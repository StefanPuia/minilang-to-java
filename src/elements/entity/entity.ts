import { XMLSchemaAnyElement, XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "../assignment/setter";
import { FieldMap } from "./field-map";
import { Converter } from "../../core/converter";
import { Tag } from "../../core/tag";

export abstract class EntityElement extends SetterElement {
    protected attributes = this.attributes as EntityElementAttributes;

    constructor(self: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(self, converter, parent);
        this.addException("GenericEntityException");
    }

    protected getFromFieldMap() {
        this.converter.addImport("UtilMisc");
        return [
            `UtilMisc.toMap(`,
            ...this.parseChildren()
                .filter((el) => el instanceof FieldMap)
                .map((el) => (el as FieldMap).convertOnlyValues())
                .join(",\n")
                .split("\n")
                .map(this.prependIndentationMapper),
            `)`,
        ];
    }
}

export interface EntityElementAttributes extends XMLSchemaElementAttributes {
    "entity-name": string;
    "value-field": string;
}
