import { EntityElement, EntityElementAttributes } from "./entity";

export class EntityCondition extends EntityElement {
    public static readonly TAG = "entity-condition";
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
                ...this.getSelectClause(),
                `.from(${this.attributes["entity-name"]})`,
                `.where(${this.getEcbName()}.build())`,
                ...this.getOrderByClause(),
                ".queryList();",
            ].map(this.prependIndentationMapper),
        ];
    }
}

interface EntityConditionAttributes extends EntityElementAttributes {
    list: string;
}

// TODO:
// <xs:choice minOccurs="0">
//     <xs:element ref="limit-range"/>
//     <xs:element ref="limit-view"/>
//     <xs:element ref="use-iterator"/>
// </xs:choice>
