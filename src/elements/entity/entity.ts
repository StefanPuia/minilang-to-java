import { XMLSchemaAnyElement, XMLSchemaElementAttributes, StringBoolean } from '../../types';
import { SetterElement } from "../assignment/setter";
import { FieldMap } from "./field-map";
import { Converter } from "../../core/converter";
import { Tag } from "../tag";

export abstract class EntityElement extends SetterElement {
    protected attributes = this.attributes as EntityElementAttributes;

    constructor(self: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(self, converter, parent);
        this.addException("GenericEntityException");
    }

    protected getFromFieldMap() {
        const conditions = this.parseChildren()
            .filter((el) => el instanceof FieldMap)
            .map((el) => (el as FieldMap).convertOnlyValues());
        if (conditions.length) {
            this.converter.addImport("UtilMisc");
            return [
                `UtilMisc.toMap(`,
                ...conditions
                    .join(",\n")
                    .split("\n")
                    .map(this.prependIndentationMapper),
                `)`,
            ];
        }
        return [];
    }

    protected getUseCache() {
        if (this.attributes["use-cache"] === "true") {
            return [`    .cache(true)`];
        }
        return [];
    }

    protected getDistinct() {
        if (this.attributes.distinct === "true") {
            return [`    .distinct()`];
        }
        return [];
    }

    protected getFilterByDate() {
        if (this.attributes["filter-by-date"] === "true") {
            return [`    .filterByDate()`];
        }
        return [];
    }

    protected getWhereClause(): string[] {
        const fieldMap = this.getFromFieldMap();
        if (!fieldMap) return [];
        return fieldMap.map((line, index, array) => {
            if (index === 0) {
                line = `.where(${line}`;
            }
            if (index === array.length - 1) {
                line = `${line})`;
            }
            return line;
        });
    }

    protected getUnsupportedAttributes() {
        return ["delegator-name"];
    }
}

export interface EntityElementAttributes extends XMLSchemaElementAttributes {
    "entity-name": string;
    "delegator-name": string;
    "filter-by-date"?: StringBoolean;
    distinct?: StringBoolean;
    "use-cache": StringBoolean;
}
