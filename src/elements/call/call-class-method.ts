import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { CallerElement } from "./caller";

export class CallClassMethod extends CallerElement {
    public static readonly TAG = "call-class-method";
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
            }(${this.getFields()})`
        );
    }
}

interface CallClassMethodAttributes extends XMLSchemaElementAttributes {
    "class-name": string;
    "method-name": string;
    "ret-field"?: string;
}
