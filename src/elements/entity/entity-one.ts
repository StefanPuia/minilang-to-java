import { ValidationMap } from "../../core/validate";
import { StringBoolean } from "../../types";
import { EntityElement, EntityElementAttributes } from "./entity";

export class EntityOne extends EntityElement {
    public static readonly TAG = "entity-one";
    protected attributes = this.attributes as EntityOneAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: [
                "entity-name",
                "use-cache",
                "auto-field-map",
                "value-field",
                "delegator-name",
            ],
            requiredAttributes: ["entity-name", "value-field"],
            expressionAttributes: ["value-field", "delegator-name"],
            childElements: ["field-map", "select-field"],
            requiredChildElements: [],
            unhandledAttributes: ["delegator-name", "auto-field-map"],
        };
    }

    public getType(): string {
        return "GenericValue";
    }

    public getField(): string {
        return this.attributes["value-field"];
    }

    public convert(): string[] {
        this.converter.addImport("GenericValue");
        this.converter.addImport("EntityQuery");
        this.addException("GenericEntityException");
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
}

interface EntityOneAttributes extends EntityElementAttributes {
    "value-field": string;
    "auto-field-map": StringBoolean;
    "for-update": StringBoolean;
}
