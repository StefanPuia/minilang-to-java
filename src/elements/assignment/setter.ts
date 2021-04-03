import ConvertUtils from "../../core/convert-utils";
import { Converter } from "../../core/converter";
import { ElementTag } from "../../core/element-tag";
import { Tag } from "../../core/tag";
import { XMLSchemaAnyElement, XMLSchemaElementAttributes } from "../../types";

export abstract class SetterElement extends ElementTag {
    protected attributes = this.attributes as BaseSetterAttributes;
    protected declared = false;

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(tag, converter, parent);
        this.declared = parent?.getVariableContext()?.includes(this.attributes.field) ?? false;
        if (!this.declared) {
            parent?.getVariableContext()?.push(this.attributes.field);
        }
    }

    protected wrapDeclaration(assign: string) {
        const declaration = this.declared ? "" : `${this.getType()} `;
        return `${declaration}${assign}`;
    }

    protected wrapConvert(assign: string) {
        const hasSetter = ConvertUtils.parseFieldSetter(
            this.attributes.field,
            assign
        );

        return (
            (hasSetter ||
                this.wrapDeclaration(`${this.attributes.field} = ${assign}`)) +
            ";"
        );
    }

    protected abstract getType(): string;
}

export interface BaseSetterAttributes extends XMLSchemaElementAttributes {
    field: string;
}
