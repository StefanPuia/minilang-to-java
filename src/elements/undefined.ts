import { ElementTag } from "./element-tag";
import { Tag } from "./tag";
import { Converter } from "../core/converter";
import { XMLSchemaElement } from "../types";

export class UndefinedElement extends ElementTag {
    constructor(self: XMLSchemaElement, converter: Converter, parent?: Tag) {
        super(self, converter, parent);
        this.converter.appendMessage("ERROR", this.getMessage());
    }

    private getMessage() {
        return `Parser not defined for element "${this.tag.name}"`;
    }

    public convert(): string[] {
        return [`// ${this.getMessage()}`, ...this.convertChildren()];
    }
}
