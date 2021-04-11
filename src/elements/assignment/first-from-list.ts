import { XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "./setter";

export class FirstFromList extends SetterElement {
    public static readonly TAG = "first-from-list";
    protected attributes = this.attributes as FirstFromListAttributes;

    public getType(): string | undefined {
        return this.getVariableFromContext(this.attributes.list)?.typeParams[0] ?? "Object";
    }
    public getField(): string | undefined {
        return this.attributes.entry;
    }
    public convert(): string[] {
        return this.wrapConvert(`${this.attributes.list}.get(0)`);
    }
}

interface FirstFromListAttributes extends XMLSchemaElementAttributes {
    entry: string;
    list: string;
}
