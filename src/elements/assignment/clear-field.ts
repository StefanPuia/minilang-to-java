import { ElementTag } from "../element-tag";
import { BaseSetterAttributes } from "./setter";

export class ClearField extends ElementTag {
    public static readonly TAG = "clear-field";
    protected attributes = this.attributes as BaseSetterAttributes;

    public getType() {
        return `Object`;
    }
    public getField(): string {
        return this.attributes.field;
    }
    public convert(): string[] {
        // TODO: this will create nullPointers for maps
        // return this.wrapConvert("null");
        return [];
    }

}