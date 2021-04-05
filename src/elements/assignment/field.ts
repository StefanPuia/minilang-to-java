import ConvertUtils from "../../core/convert-utils";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class Field extends SetterElement {
    public getField(): string | undefined {
        return this.attributes.field;
    }
    protected attributes = this.attributes as FieldAttributes;

    public getType(): string | undefined {
        return this.attributes.type;
    }

    public convert(): string[] {
        return [
            ConvertUtils.parseFieldGetter(this.attributes.field) ?? this.attributes.field
        ];
    }
}

interface FieldAttributes extends BaseSetterAttributes {
    type?: string;
}
