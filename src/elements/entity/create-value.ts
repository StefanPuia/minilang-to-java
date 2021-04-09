import { ElementTag } from "../element-tag";
import { XMLSchemaElementAttributes, StringBoolean } from "../../types";
export class CreateValue extends ElementTag {
    protected attributes = this.attributes as CreateValueAttributes;

    public convert() {
        const method =
            this.attributes["or-store"] === "true" ? "store" : "create";
        return [`${this.attributes["value-field"]}.${method}();`];
    }

    protected getUnsupportedAttributes() {
        return ["do-cache-clear"];
    }
}

interface CreateValueAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "do-cache-clear"?: StringBoolean;
    "or-store"?: StringBoolean;
}
