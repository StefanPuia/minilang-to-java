import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class RemoveList extends ElementTag {
    protected attributes = this.attributes as RemoveListAttributes;

    public convert(): string[] {
        this.setVariableToContext({ name: "delegator" });
        return [
            `delegator.removeAll(${
                ConvertUtils.parseFieldGetter(this.attributes.list) ??
                this.attributes.list
            });`,
        ];
    }

    protected getUnsupportedAttributes() {
        return ["do-cache-clear", "delegator-name"];
    }
}

interface RemoveListAttributes extends XMLSchemaElementAttributes {
    "list": string;
    "do-cache-clear"?: string;
    "delegator-name"?: string;
}
