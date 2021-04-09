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
        this.setVariableToContext({ name: "delegator" });
        return [
            ...this.wrapConvert("EntityQuery.use(delegator)", false),
            ...this.getChainLines().map(this.prependIndentationMapper),
        ];
    }

    private getChainLines() {
        const whereClause = this.getWhereClause();
        return [
            ...this.getSelectClause(),
            `.from("${this.attributes["entity-name"]}")`,
            ...whereClause,
            ...this.getOrderByClause(),
            ...this.getUseCache(),
            `.query${whereClause.length ? "One" : "First"}();`,
        ];
    }

    protected getUnsupportedAttributes() {
        return [
            ...super.getUnsupportedAttributes(),
            "auto-field-map",
            "for-update",
        ];
    }
}

interface EntityOneAttributes extends EntityElementAttributes {
    "value-field": string;
    "auto-field-map": StringBoolean;
    "for-update": StringBoolean;
}
