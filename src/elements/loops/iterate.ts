import { XMLSchemaElementAttributes } from "../../types";
import { Loop } from "./loop";

export class Iterate extends Loop {
    protected attributes = this.attributes as IterateAttributes;

    public convert(): string[] {
        return [
            `for (${this.getItemType()} ${this.attributes.entry} : ${
                this.attributes.list
            }) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getItemType() {
        return (
            this.getVariableFromContext(this.attributes.list)?.typeParams[0] ??
            "Object"
        );
    }
}

interface IterateAttributes extends XMLSchemaElementAttributes {
    list: string;
    entry: string;
}
