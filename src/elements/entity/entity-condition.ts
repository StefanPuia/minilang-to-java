import { EntityElement, EntityElementAttributes } from "./entity";

export class EntityCondition extends EntityElement {
    protected attributes = this.attributes as EntityConditionAttributes;

    public getType(): string | undefined {
        this.converter.addImport("List");
        this.converter.addImport("GenericValue");
        return "List<GenericValue>";
    }
    public getField(): string | undefined {
        return this.attributes.list;
    }
    public convert(): string[] {
        return [
            ...this.getConditionBuilder(),
            ...this.wrapConvert(`EntityQuery.use(delegator)`),
            ...[
                `.from(${this.attributes["entity-name"]})`,
                `.where(${this.getEcbName()}.build())`,
                ".queryList();",
            ].map(this.prependIndentationMapper),
        ];
    }

    private getEcbName() {
        return `${this.attributes.list}Condition`;
    }

    private getConditionBuilder(): string[] {
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
                .map(this.prependIndentationMapper),
        ];
    }
}

interface EntityConditionAttributes extends EntityElementAttributes {
    list: string;
}
