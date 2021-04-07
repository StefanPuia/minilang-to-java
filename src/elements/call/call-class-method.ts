import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { Field } from "../assignment/field";
import { StringTag } from "../assignment/string";
import { CallerElement } from "./caller";

export class CallClassMethod extends CallerElement {
    public getType() {
        return (
            (this.attributes["ret-field"] &&
                this.converter.guessFieldType(this.attributes["ret-field"])) ||
            "Object"
        );
    }
    public getField() {
        return this.attributes["ret-field"];
    }
    protected attributes = this.attributes as CallClassMethodAttributes;

    public convert(): string[] {
        this.converter.addImport(this.attributes["class-name"]);
        return this.wrapConvert(
            `${ConvertUtils.unqualify(this.attributes["class-name"])}.${
                this.attributes["method-name"]
            }(${this.getFields().join(", ")})`
        );
    }
    private getFields() {
        return [
            ...this.parseChildren()
                .filter((tag) => tag instanceof Field)
                .map((tag) => (tag as Field).convert()),
            ...this.parseChildren()
                .filter((tag) => tag instanceof StringTag)
                .map((tag) => (tag as StringTag).convert()),
        ];
    }
}

interface CallClassMethodAttributes extends XMLSchemaElementAttributes {
    "class-name": string;
    "method-name": string;
    "ret-field"?: string;
}
