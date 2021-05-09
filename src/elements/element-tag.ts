import {
    Position,
    XMLSchemaAnyElement,
    XMLSchemaElement,
    XMLSchemaElementAttributes,
} from "../types";
import { Converter } from "../core/converter";
import { Tag } from "./tag";

export abstract class ElementTag extends Tag {
    protected tag: XMLSchemaElement;
    protected attributes: XMLSchemaElementAttributes;
    protected readonly position?: Position;

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(tag, converter, parent);
        this.tag = tag as XMLSchemaElement;
        this.attributes = this.tag.attributes ?? {};
        this.position = this.tag.position;
    }

    public getTagName() {
        return this.tag.name;
    }

    public convertChildren(): string[] {
        return this.parseChildren()
            .map((tag) => tag.convert())
            .flat();
    }

    public getValidChildren() {
        return {};
    }

    public getTagAttributes() {
        return this.tag.attributes ?? {};
    }

    public getPosition(): Position | undefined {
        return this.tag.position;
    }


    public getInstance<
        T extends XMLSchemaElementAttributes,
        E extends ElementTag = ElementTag
    >(elementTag: ElementTagConstructor<E>, attributes: T): E {
        return new elementTag(
            {
                type: "element",
                name: this.getTagName(),
                attributes,
            },
            this.converter,
            this.parent
        );
    }
}

interface ElementTagConstructor<E extends ElementTag> {
    new (el: XMLSchemaAnyElement, converter: Converter, parent?: Tag): E;
}
