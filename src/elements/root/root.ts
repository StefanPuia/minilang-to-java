import { Converter } from "../../core/converter";
import { XMLSchemaAnyElement, XMLSchemaElement } from "../../types";
import { ElementTag } from "../element-tag";
import { Tag } from "../tag";

export class Root extends ElementTag {
    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        super(tag, converter, parent);
        this.wrapClass();
        this.wrapMethod();
    }

    public convert(): string[] {
        return this.convertChildren();
    }

    private wrapClass() {
        if (
            !this.tag.elements?.find(
                (el) => el.type === "element" && el.name === "simple-methods"
            )
        ) {
            this.tag.elements = [
                {
                    type: "element",
                    name: "simple-methods",
                    attributes: {},
                    elements: this.tag.elements,
                },
            ];
        }
    }

    private wrapMethod() {
        this.tag.elements
            ?.filter(
                (el) => el.type === "element" && el.name === "simple-methods"
            )
            .forEach((el) => {
                const clazz = el as XMLSchemaElement;
                if (
                    !clazz.elements?.find(
                        (el) =>
                            el.type === "element" && el.name === "simple-method"
                    )
                ) {
                    clazz.elements = [
                        {
                            type: "element",
                            name: "simple-method",
                            attributes: {
                                "method-name": "generatedMethod",
                            },
                            elements: clazz.elements,
                        },
                    ];
                }
            });
    }
}
