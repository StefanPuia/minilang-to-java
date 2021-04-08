import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes } from "../../types";

export class FailMessage extends ElementTag {
    protected attributes = this.attributes as FailMessageAttributes;

    public convert(): string[] {
        return this.converter.getErrorHandler().returnError(`"${this.attributes.message}"`);
    }
}

interface FailMessageAttributes extends XMLSchemaElementAttributes {
    message: string;
}
