import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { CallerElement } from "./caller";

export class CallClassMethod extends CallerElement {
    protected attributes = this.attributes as CallClassMethodAttributes;

    public convert(): string[] {
        this.converter.addImport(this.attributes["class-name"]);
        return [`${ConvertUtils.unqualify(this.attributes["class-name"])}.${this.attributes["method-name"]}()`];
    }
}

interface CallClassMethodAttributes extends XMLSchemaElementAttributes {
    "class-name": string;
    "method-name": string;
    "ret-field"?: string;
}
