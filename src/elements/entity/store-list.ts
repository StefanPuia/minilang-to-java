import ConvertUtils from "../../core/convert-utils";
import { ValidationMap } from "../../core/validate";
import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class StoreList extends ElementTag {
    public static readonly TAG = "store-list";
    protected attributes = this.attributes as StoreListAttributes;

    public convert(): string[] {
        this.addException("GenericEntityException");
        this.setVariableToContext({ name: "delegator" });
        return [
            `delegator.storeAll(${
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

interface StoreListAttributes extends XMLSchemaElementAttributes {
    "list": string;
    "do-cache-clear"?: StringBoolean;
    "delegator-name"?: string;
}
