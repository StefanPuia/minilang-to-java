import { ElementTag } from "../../core/element-tag";
import {
    VariableContext,
    XMLSchemaAnyElement,
    XMLSchemaElement,
} from "../../types";
import { Converter } from "../../core/converter";
import { Tag } from "../../core/tag";

export class Root extends ElementTag {
    private variableContext: VariableContext = {};

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
                                "method-name": "someMethodName",
                            },
                            elements: clazz.elements,
                        },
                    ];
                }
            });
    }

    public getVariableContext() {
        return this.variableContext;
    }
}
