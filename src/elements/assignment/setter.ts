import ConvertUtils from "../../core/convert-utils";
import { Converter } from "../../core/converter";
import { ElementTag } from "../../core/element-tag";
import { Tag } from "../../core/tag";
import { XMLSchemaAnyElement, XMLSchemaElementAttributes } from "../../types";

export abstract class SetterElement extends ElementTag {
    protected declared = false;
    protected mapName: string | undefined;

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(tag, converter, parent);
        const field = this.getField();
        if (typeof field !== "undefined") {
            const { mapName } = ConvertUtils.mapMatch(field);
            this.mapName = mapName;
            const context = parent?.getVariableContext();
            this.declared = !!context?.[mapName ?? field];
            if (context) {
                if (!this.declared) {
                    const { type, params } = this.getBaseType();
                    context[mapName ?? field] = {
                        name: mapName ?? field,
                        count: 1,
                        type,
                        typeParams: params,
                    };
                } else if (context[mapName ?? field]) {
                    context[mapName ?? field].count++;
                }
            }
        }
    }

    /**
     * appends the class if the variable has not already been defined
     */
    public wrapDeclaration(assign: string) {
        const declaration = this.declared || !this.getType() ? "" : `${this.getType()} `;
        return `${declaration}${assign}`;
    }

    /**
     * returns declaration line for map with new instance of a hashmap or nothing if variable does not match a map
     */
    private getMapDeclaration() {
        if (this.mapName && !this.declared && !["request"].includes(this.mapName)) {
            this.converter.addImport("Map");
            this.converter.addImport("HashMap");
            return [`Map ${this.mapName} = new HashMap();`];
        }
        return [];
    }

    /**
     * creates a set statement (either with setter or assignment)
     * adds the class if not declared
     */
    public wrapConvert(assign: string): string[] {
        if (!this.getField()) {
            return [assign];
        }
        const hasSetter = ConvertUtils.hasSetter(this.getField());
        const setter = ConvertUtils.parseFieldSetter(this.getField(), assign);

        return [
            ...this.getMapDeclaration(),
            `${
                hasSetter
                    ? setter
                    : this.wrapDeclaration(`${this.getField()}${assign ? ` = ${assign}` : ""}`)
            };`,
        ];
    }

    public getBaseType(): { type: string; params: string[] } {
        const { type, params } =
            (this.getType() ?? "").match(/^(?<type>\w+)(?:\<(?<params>.+?)\>)?$/)?.groups ?? {};
        return {
            type: type ?? this.getType(),
            params: params && params.replace(/\s/g, "").split(",") || [],
        };
    }

    public abstract getType(): string | undefined;
    public abstract getField(): string | undefined;
}

export interface BaseSetterAttributes extends XMLSchemaElementAttributes {
    field: string;
}
