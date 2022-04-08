import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class RemoveList extends ElementTag {
    public static readonly TAG = "remove-list";
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

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["do-cache-clear", "delegator-name"],
        };
    }
}

interface RemoveListAttributes extends XMLSchemaElementAttributes {
    "list": string;
    "do-cache-clear"?: string;
    "delegator-name"?: string;
}
