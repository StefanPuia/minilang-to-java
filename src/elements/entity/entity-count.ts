import { XMLSchemaElementAttributes } from "../../types";
import { EntityElement } from "./entity";

export class EntityCount extends EntityElement {
    public static readonly TAG = "entity-count";
    protected attributes = this.attributes as EntityCountAttributes;

    public getType(): string | undefined {
        return "long";
    }
    public getField(): string | undefined {
        return this.attributes["count-field"];
    }
    public convert(): string[] {
        this.converter.addImport("EntityQuery");
        this.addException("GenericEntityException");
        this.setVariableToContext({ name: "delegator" });
        return [
            ...this.getConditionBuilder(),
            ...this.wrapConvert("EntityQuery.use(delegator)", false),
            ...[
                `.from("${this.attributes["entity-name"]}")`,
                `.where(${this.getEcbName()}.build())`,
                `.queryCount();`,
            ].map(this.prependIndentationMapper),
        ];
    }
}

interface EntityCountAttributes extends XMLSchemaElementAttributes {
    "entity-name": string;
    "count-field": string;
    "delegator-name"?: string;
}
