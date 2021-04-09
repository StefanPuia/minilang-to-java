import ConvertUtils from "../../core/convert-utils";
import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class RemoveValue extends ElementTag {
    protected attributes = this.attributes as RemoveValueAttributes;

    public convert(): string[] {
        this.addException("GenericEntityException");
        return [
            `${
                ConvertUtils.parseFieldGetter(this.attributes["value-field"]) ??
                this.attributes["value-field"]
            }.remove();`,
        ];
    }

    protected getUnsupportedAttributes() {
        return ["do-cache-clear"];
    }
}

interface RemoveValueAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "do-cache-clear"?: StringBoolean;
}
