import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { CallerElement } from "./caller";

export class CallObjectMethod extends CallerElement {
    protected attributes = this.attributes as CallObjectMethodAttributes;

    public getType(): string | undefined {
        return (
            (this.attributes["ret-field"] &&
                this.converter.guessFieldType(this.attributes["ret-field"])) ||
            "Object"
        );
    }
    public getField(): string | undefined {
        return this.attributes["ret-field"];
    }
    public convert(): string[] {
        return this.wrapConvert(
            `${ConvertUtils.parseFieldGetter(this.attributes["obj-field"])}.${
                this.attributes["method-name"]
            }(${this.getFields()})`,
        );
    }
}

interface CallObjectMethodAttributes extends XMLSchemaElementAttributes {
    "method-name": string;
    "obj-field": string;
    "ret-field"?: string;
}
