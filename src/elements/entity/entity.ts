import {
    XMLSchemaAnyElement,
    XMLSchemaElementAttributes,
    StringBoolean,
} from "../../types";
import { SetterElement } from "../assignment/setter";
import { FieldMap } from "./field-map";
import { Converter } from "../../core/converter";
import { Tag } from "../tag";
import { SelectField } from "./select-field";
import { OrderBy } from "./order-by";

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

    protected getSelectClause(): string[] {
        const fields = this.parseChildren()
            .filter((el) => el.getTagName() === "select-field")
            .map((el) => (el as SelectField).getFieldName());
        if (fields.length) {
            return [
                `.select(${fields.map((field) => `"${field}"`).join(", ")})`,
            ];
        }
        return [];
    }

    protected getOrderByClause(): string[] {
        const fields = this.parseChildren()
            .filter((el) => el.getTagName() === "order-by")
            .map((el) => (el as OrderBy).getFieldName());
        if (fields.length) {
            return [
                `.orderBy(${fields.map((field) => `"${field}"`).join(", ")})`,
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

    protected getEcbName() {
        return `${this.getField()}Condition`;
    }

    protected getConditionBuilder(): string[] {
        const ecbDeclared = this.getVariableFromContext(this.getEcbName());
        this.converter.addImport("EntityConditionBuilder");
        this.setVariableToContext({
            name: this.getEcbName(),
            type: "EntityConditionBuilder",
        });
        const declaration = ecbDeclared ? "" : "EntityConditionBuilder ";
        return [
            `${declaration}${this.getEcbName()} = EntityConditionBuilder.create()`,
            ...this.parseChildren()
                .filter((tag) =>
                    [
                        "condition-expr",
                        "condition-list",
                        "condition-object",
                    ].includes(tag.getTagName())
                )
                .map((tag) => tag.convert())
                .flat()
                .map(this.prependIndentationMapper)
                .map((line, index, list) =>
                    index === list.length - 1 ? `${line};` : line
                ),
        ];
    }
}

export interface EntityElementAttributes extends XMLSchemaElementAttributes {
    "entity-name": string;
    "delegator-name"?: string;
    "filter-by-date"?: StringBoolean;
    "distinct"?: StringBoolean;
    "use-cache"?: StringBoolean;
}
