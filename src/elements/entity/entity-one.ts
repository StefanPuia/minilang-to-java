import { StringBoolean } from "../../types";
import { EntityElement, EntityElementAttributes } from "./entity";

export class EntityOne extends EntityElement {
    protected attributes = this.attributes as EntityOneAttributes;

    public getType(): string {
        return "GenericValue";
    }

    public getField(): string {
        return this.attributes["value-field"];
    }

    public convert(): string[] {
        this.converter.addImport("GenericValue");
        this.converter.addImport("EntityQuery");
        return [
            ...this.wrapConvert("EntityQuery.use(delegator)", false),
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
        return this.getFromFieldMap().map((line, index, array) => {
            if (index === 0) {
                line = `.where(${line}`;
            }
            if (index === array.length - 1) {
                line = `${line})`;
            }
            return line;
        });
    }

    protected getUseCache() {
        if (this.attributes["use-cache"] === "true") {
            return [`    .cache(true)`];
        }
        return [];
    }
}

interface EntityOneAttributes extends EntityElementAttributes {
    "use-cache": string;
    "auto-field-map": StringBoolean;
    "delegator-name": string;
    "for-update": StringBoolean;
}
