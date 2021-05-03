import { ElementTag } from "./element-tag";
import { Tag } from "./tag";
import { Converter } from "../core/converter";
import { XMLSchemaElement } from "../types";

export class UndefinedElement extends ElementTag {
    constructor(self: XMLSchemaElement, converter: Converter, parent?: Tag) {
        super(self, converter, parent);
        this.converter.appendMessage("ERROR", this.getMessage(), this.position);
    }

    private getMessage() {
        return `Parser not defined for ${this.getType()} ${this.getTagName()}`.trim();
    }

    private getType() {
        return (
            (this.tag.type !== "element" && `${this.tag.type} element`) ||
            "element"
        );
    }

    public getTag() {
        return this.tag;
    }

    public convert(): string[] {
        return [
            `// ${this.getMessage()}`,
            ...this.convertChildren().map(this.prependIndentationMapper),
        ];
    }
}
