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
        const { mapName } = ConvertUtils.mapMatch(this.getField());
        this.mapName = mapName;
        this.declared = parent?.getVariableContext()?.includes(mapName ?? this.getField()) ?? false;
        if (!this.declared) {
            parent?.getVariableContext()?.push(mapName ?? this.getField());
        }
    }

    protected wrapDeclaration(assign: string) {
        const declaration = this.declared ? "" : `${this.getType()} `;
        return `${declaration}${assign}`;
    }

    private getMapDeclaration() {
        if (this.mapName && !this.declared) {
            this.converter.addImport("Map");
            this.converter.addImport("HashMap");
            return [`Map ${this.mapName} = new HashMap();`];
        }
        return [];
    }

    protected wrapConvert(assign: string): string[] {
        const hasSetter = ConvertUtils.hasSetter(this.getField());
        const setter = ConvertUtils.parseFieldSetter(this.getField(), assign);

        return [
            ...this.getMapDeclaration(),
            `${hasSetter ? setter : this.wrapDeclaration(`${this.getField()} = ${assign}`)};`,
        ];
    }

    protected abstract getType(): string;
    protected abstract getField(): string;
}

export interface BaseSetterAttributes extends XMLSchemaElementAttributes {
    field: string;
}
