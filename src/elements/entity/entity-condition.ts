import { ValidationMap } from "../../core/validate";
import { EntityElement, EntityElementAttributes } from "./entity";

export class EntityCondition extends EntityElement {
    public static readonly TAG = "entity-condition";
    protected attributes = this.attributes as EntityConditionAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: [
                "entity-name",
                "use-cache",
                "filter-by-date",
                "list",
                "distinct",
                "delegator-name",
            ],
            requiredAttributes: ["entity-name", "list"],
            expressionAttributes: ["list", "delegator-name"],
            childElements: [
                "condition-expr",
                "condition-list",
                "condition-object",
                "having-condition-list",
                "select-field",
                "order-by",
                "limit-range",
                "limit-view",
                "use-iterator",
            ],
            requireAnyChildElement: [
                "condition-expr",
                "condition-list",
                "condition-object",
            ],
        };
    }

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
            ...this.wrapConvert(`EntityQuery.use(delegator)`, false),
            ...[
                ...this.getSelectClause(),
                ...this.getFrom(),
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
