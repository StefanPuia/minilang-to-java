import { ValidationMap } from "../../core/validate";
import { CallObjectMethod } from "../call/call-object-method";
import { ElementTag } from "../element-tag";
import { SetPKFieldsAttributes } from "./set-pk-fields";

export class SetNonPKFields extends ElementTag {
    public static readonly TAG = "set-nonpk-fields";
    protected attributes = this.attributes as SetPKFieldsAttributes;

    public convert(): string[] {
        return new CallObjectMethod(
            {
                type: "element",
                name: "call-object-method",
                attributes: {
                    "method-name": "setNonPKFields",
                    "obj-field": this.attributes["value-field"],
                },
                elements: [
                    {
                        type: "element",
                        name: "field",
                        attributes: {
                            field: this.attributes.map,
                        },
                    },
                ],
            },
            this.converter,
            this.parent
        ).convert();
    }

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["set-if-null"],
        };
    }
}
