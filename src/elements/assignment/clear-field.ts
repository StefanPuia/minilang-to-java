import { ElementTag } from "../../core/element-tag";
import { BaseSetterAttributes } from "./setter";

export class ClearField extends ElementTag {
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