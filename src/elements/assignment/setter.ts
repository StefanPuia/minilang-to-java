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
            this.declared = !!this.getVariableFromContext(mapName ?? field);
            const { type, typeParams: params } = this.getBaseType();
            this.setVariableToContext({
                name: mapName ?? field,
                count: 1,
                type,
                typeParams: params,
            });
        }
    }

    /**
     * appends the class if the variable has not already been defined
     */
    public wrapDeclaration(assign: string) {
        const field = this.getField();
        if (field && !this.mapName) {
            this.setVariableToContext({
                name: field,
                count: 1,
                ...this.getBaseType(),
            });
        }
        this.converter.addImport(this.getBaseType()?.type);
        const declaration =
            this.declared || !this.getType() ? "" : `${this.getType()} `;
        return `${declaration}${assign}`;
    }

    /**
     * returns declaration line for map with new instance of a hashmap or nothing if variable does not match a map
     */
    private getMapDeclaration() {
        if (
            this.mapName &&
            !this.declared &&
            !["request"].includes(this.mapName)
        ) {
            this.setVariableToContext({
                name: this.mapName,
                type: "Map",
                count: 1,
                typeParams: ["String, Object"],
            });
            this.converter.addImport("Map");
            this.converter.addImport("HashMap");
            return [`Map<String, Object> ${this.mapName} = new HashMap<>();`];
        }
        return [];
    }

    /**
     * creates a set statement (either with setter or assignment)
     * adds the class if not declared
     */
    public wrapConvert(assign: string, semicolon: boolean = true): string[] {
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
                    : this.wrapDeclaration(
                          `${this.getField()}${assign ? ` = ${assign}` : ""}`
                      )
            }${semicolon ? ";" : ""}`,
        ];
    }

    public getBaseType(): { type: string; typeParams: string[] } {
        const field = this.getField();
        const selfType =
            (field && this.getVariableFromContext(field)?.type) ||
            this.getType();
        const { type, params } =
            (selfType ?? "").match(/^(?<type>\w+)(?:\<(?<params>.+?)\>)?$/)
                ?.groups ?? {};
        return {
            type: type ?? selfType,
            typeParams: (params && params.replace(/\s/g, "").split(",")) || [],
        };
    }

    public abstract getType(): string | undefined;
    public abstract getField(): string | undefined;
}

export interface BaseSetterAttributes extends XMLSchemaElementAttributes {
    field: string;
}
