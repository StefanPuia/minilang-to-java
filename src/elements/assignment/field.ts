import ConvertUtils from "../../core/convert-utils";
import { FlexibleMapAccessor } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class Field extends SetterElement {
    public static readonly TAG = "field";
    protected attributes = this.attributes as FieldRawAttributes;

    public getField(): string | undefined {
        return this.attributes.field;
    }

    private getAttributes(): FieldAttributes {
        return {
            type: "String",
            ...this.attributes,
        };
    }

    public getType(): string {
        return this.getAttributes().type;
    }

    public convert(): string[] {
        const getter = ConvertUtils.parseFieldGetter(
            this.getAttributes().field
        );
        return [
            getter ? `${this.getCast()}${getter}` : this.getAttributes().field,
        ];
    }

    private getCast() {
        return ConvertUtils.requiresCast(
            this.getAttributes().field,
            this.getType()
        )
            ? `(${this.getType()}) `
            : "";
    }
}

interface FieldRawAttributes extends BaseSetterRawAttributes {
    type?: string;
}

interface FieldAttributes {
    field: FlexibleMapAccessor;
    type: string;
}
