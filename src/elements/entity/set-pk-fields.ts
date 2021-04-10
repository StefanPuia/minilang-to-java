import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { CallObjectMethod } from "../call/call-object-method";
import { ElementTag } from "../element-tag";

export class SetPKFields extends ElementTag {
    protected attributes = this.attributes as SetPKFieldsAttributes;

    public convert(): string[] {
        return new CallObjectMethod(
            {
                type: "element",
                name: "call-object-method",
                attributes: {
                    "method-name": "setPKFields",
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

    protected getUnsupportedAttributes() {
        return ["set-if-null"];
    }
}

export interface SetPKFieldsAttributes extends XMLSchemaElementAttributes {
    "value-field": string;
    "map": string;
    "set-if-null"?: StringBoolean;
}
