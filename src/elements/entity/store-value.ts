import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes, StringBoolean } from "../../types";
import { ValidationMap } from "../../core/validate";

export class StoreValue extends ElementTag {
    public static readonly TAG = "store-value";
    protected attributes = this.attributes as StoreValueAttributes;

    public convert() {
        return [`${this.attributes["value-field"]}.store();`];
    }

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["do-cache-clear"],
        };
    }
}

interface StoreValueAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "do-cache-clear"?: StringBoolean;
}
