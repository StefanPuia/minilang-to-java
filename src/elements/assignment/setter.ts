import ConvertUtils from "../../core/utils/convert-utils";
import { Converter } from "../../core/converter";
import { XMLSchemaAnyElement, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";
import { Tag } from "../tag";
import { unqualify } from "../../core/utils/import-utils";

export abstract class SetterElement extends ElementTag {
    protected declared = false;
    protected mapName: string | undefined;

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(tag, converter, parent);
        const field = this.getField();
        if (typeof field !== "undefined") {
            const { mapName } = ConvertUtils.mapMatch(field);
            this.mapName = mapName;
            this.declared =
                (this.getVariableFromContext(mapName ?? field)?.count ?? 0) > 0;
            const { type, typeParams } = this.getBaseType();
            this.converter.addImport(type);
            this.setVariableToContext({
                name: mapName ?? field,
                type,
                typeParams,
            });
        }
    }

    /**
     * appends the class if the variable has not already been defined
     */
    public wrapDeclaration(assign: string) {
        this.converter.addImport(this.getBaseType()?.type);
        const declaration =
            this.declared || !this.getType()
                ? ""
                : `${unqualify(this.getType() ?? "")} `;
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
            return [`${assign}${semicolon ? ";" : ""}`];
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

export interface BaseSetterRawAttributes extends XMLSchemaElementAttributes {
    field: string;
}
