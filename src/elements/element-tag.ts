import { XMLSchemaAnyElement, XMLSchemaElement, XMLSchemaElementAttributes } from "../types";
import { Converter } from "../core/converter";
import { Tag } from "./tag";

export abstract class ElementTag extends Tag {
    protected tag: XMLSchemaElement;
    protected attributes: XMLSchemaElementAttributes;

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(tag, converter, parent);
        this.tag = tag as XMLSchemaElement;
        this.attributes = this.tag.attributes;

        this.checkUnsupportedTags();
    }

    private checkUnsupportedTags() {
        for (const attr of this.getUnsupportedAttributes()) {
            if (typeof this.attributes[attr] !== "undefined") {
                this.converter.appendMessage(
                    "WARNING",
                    `Attribute "${attr}" is not supported for tag "${this.getTagName()}"`
                );
            }
        }
    }

    public getTagName() {
        return this.tag.name;
    }

    public convertChildren(): string[] {
        this.parseChildren();
        return this.parseChildren().map((tag) => tag.convert()).flat();
    }

    public getValidChildren() {
        return {};
    }

    protected getUnsupportedAttributes(): string[] {
        return [];
    }
}
