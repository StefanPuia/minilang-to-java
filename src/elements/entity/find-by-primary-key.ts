import ConvertUtils from "../../core/utils/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { EntityElement } from "./entity";

export class FindByPrimaryKey extends EntityElement {
    public static readonly TAG = "find-by-primary-key";
    protected attributes = this.attributes as FindByPrimaryKeyAttributes;

    public getType(): string | undefined {
        this.converter.addImport("GenericValue");
        return "GenericValue";
    }
    public getField(): string | undefined {
        return this.attributes["value-field"];
    }
    public convert(): string[] {
        this.setVariableToContext({ name: "delegator" });
        this.addException("GenericEntityException");
        return this.attributes["fields-to-select-list"]
            ? this.getQuery()
            : this.getDelegatorMethod();
    }

    private getMap() {
        return (
            ConvertUtils.parseFieldGetter(this.attributes.map) ??
            this.attributes.map
        );
    }

    private getQuery(): string[] {
        return this.wrapConvert(
            `delegator.findByPrimaryKeyPartial(delegator.makePK("${
                this.attributes["entity-name"]
            }", ${this.getMap()}), UtilMisc.toSet(${
                this.attributes["fields-to-select-list"]
            }))`
        );
    }

    private getDelegatorMethod(): string[] {
        return [
            ...this.wrapConvert(`EntityQuery.use(delegator)`, false),
            ...[
                ...this.getFrom(),
                `.where(${this.getMap()})`,
                ...this.getUseCache(),
                `.queryOne();`,
            ].map(this.prependIndentationMapper),
        ];
    }
}

interface FindByPrimaryKeyAttributes extends XMLSchemaElementAttributes {
    "entity-name"?: string;
    "value-field": string;
    "map": string;
    "fields-to-select-list"?: string;
    "use-cache"?: string;
    "delegator-name"?: string;
}

// if (fieldsToSelectList != null) {
//     valueFma.put(methodContext.getEnvMap(), delegator.findByPrimaryKeyPartial(delegator.makePK(entityName, inMap), UtilMisc.toSet(fieldsToSelectList)));
// } else  else {
//     valueFma.put(methodContext.getEnvMap(), EntityQuery.use(delegator).from(entityName).where(inMap).cache(useCache).queryOne());
// }
