import { EntityElement, EntityElementAttributes } from "./entity";

export class EntityAnd extends EntityElement {
    protected attributes = this.attributes as EntityAndAttributes;

    public convert(): string[] {
        this.converter.addImport("List");
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
            `.from("${this.attributes["entity-name"]}")`,
            ...whereClause,
            ...this.getUseCache(),
            ...this.getFilterByDate(),
            ...this.getDistinct(),
            `.queryList();`,
        ];
    }

    public getType() {
        this.converter.addImport("List");
        return "List<GenericValue>";
    }

    public getField(): string {
        return this.attributes.list;
    }
}

interface EntityAndAttributes extends EntityElementAttributes {
    list: string;
}
