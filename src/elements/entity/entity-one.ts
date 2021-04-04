import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { EntityElement } from "./entity";

export class EntityOne extends EntityElement {
    protected attributes = this.attributes as EntityOneAttributes;

    protected getType(): string {
        return "GenericValue";
    }

    protected getField(): string {
        return this.attributes["value-field"];
    }

    public convert(): string[] {
        this.converter.addImport("GenericValue");
        return [
            ...this.wrapConvert("EntityQuery.use(delegator)"),
            ...this.getChainLines().map(this.prependIndentationMapper),
        ];
    }

    private getChainLines() {
        return [
            `.from("${this.attributes["entity-name"]}")`,
            ...this.getWhereClause(),
            ...this.getUseCache(),
            `.queryOne();`,
        ];
    }

    protected getWhereClause(): string[] {
        return [`.where(`, ...this.getFromFieldMap().map(this.prependIndentationMapper), `)`];
    }

    protected getUseCache() {
        if (this.attributes["use-cache"] === "true") {
            return [`    .cache(true)`];
        }
        return [];
    }
}

interface EntityOneAttributes extends XMLSchemaElementAttributes {
    "entity-name": string;
    "value-field": string;
    "use-cache": string;
    "auto-field-map": StringBoolean;
    "delegator-name": string;
    "for-update": StringBoolean;
}
