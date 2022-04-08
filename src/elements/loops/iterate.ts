import { DEFAULT_TYPE } from "../../consts";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { LoopingElement } from "./looping";

export class Iterate extends LoopingElement {
    public static readonly TAG = "iterate";
    protected attributes = this.attributes as IterateRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["entry", "list"],
            expressionAttributes: ["entry", "list"],
            requiredAttributes: ["entry", "list"],
        };
    }

    private getAttributes(): IterateAttributes {
        return {
            ...this.attributes,
        };
    }

    public convert(): string[] {
        return [
            `for (${this.getItemType()} ${this.getAttributes().entry} : ${
                this.getAttributes().list
            }) {`,
            ...this.convertChildren().map(this.prependIndentationMapper),
            "}",
        ];
    }

    private getItemType() {
        return (
            this.getVariableFromContext(this.getAttributes().list)
                ?.typeParams[0] ?? DEFAULT_TYPE
        );
    }
}

interface IterateRawAttributes extends XMLSchemaElementAttributes {
    list: string;
    entry: string;
}

interface IterateAttributes {
    entry: FlexibleMapAccessor;
    list: FlexibleMapAccessor;
}
