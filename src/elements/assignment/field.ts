import ConvertUtils from "../../core/convert-utils";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class Field extends SetterElement {
    public static readonly TAG = "field";
    public getField(): string | undefined {
        return this.attributes.field;
    }
    protected attributes = this.attributes as FieldAttributes;

    public getType(): string | undefined {
        return this.attributes.type;
    }

    public convert(): string[] {
        const getter = ConvertUtils.parseFieldGetter(this.attributes.field);
        return [getter ? `${this.getCast()}${getter}` : this.attributes.field];
    }

    private getCast() {
        if (
            !ConvertUtils.requiresCast(
                this.attributes.field,
                this.attributes.type
            )
        ) {
            return "";
        }
        return this.attributes.type ? `(${this.attributes.type}) ` : "";
    }
}

interface FieldAttributes extends BaseSetterAttributes {
    type?: string;
}
