import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes, StringBoolean } from "../../types";
export class StoreValue extends ElementTag {
    protected attributes = this.attributes as StoreValueAttributes;

    public convert() {
        return [`${this.attributes["value-field"]}.store();`];
    }

    protected getUnsupportedAttributes() {
        return ["do-cache-clear"];
    }
}

interface StoreValueAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "do-cache-clear"?: StringBoolean;
}
