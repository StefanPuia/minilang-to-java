import ConvertUtils from "../../core/convert-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { CallerElement } from "./caller";

export class CallObjectMethod extends CallerElement {
    public static readonly TAG = "call-object-method";
    protected attributes = this.attributes as CallObjectMethodRawAttributes;

    private getAttributes(): CallObjectMethodAttributes {
        return {
            objField: this.attributes["obj-field"],
            methodName: this.attributes["method-name"],
            retField: this.attributes["ret-field"],
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["obj-field", "method-name", "ret-field"],
            constantAttributes: ["method-name"],
            requiredAttributes: ["obj-field", "method-name"],
            childElements: ["string", "field"],
        };
    }

    public getType(): string | undefined {
        const retField = this.getField();
        return (
            (retField && this.converter.guessFieldType(retField)) || "Object"
        );
    }
    public getField(): string | undefined {
        return this.getAttributes().retField;
    }
    public convert(): string[] {
        this.converter.appendMessage(
            "DEPRECATE",
            "<call-object-method> element is deprecated (use <script>)",
            this.position
        );
        return this.wrapConvert(
            `${ConvertUtils.parseFieldGetter(this.getAttributes().objField)}.${
                this.getAttributes().methodName
            }(${this.getFields()})`
        );
    }
}

interface CallObjectMethodRawAttributes extends XMLSchemaElementAttributes {
    "method-name": string;
    "obj-field": string;
    "ret-field"?: string;
}

interface CallObjectMethodAttributes {
    methodName: string;
    objField: FlexibleMapAccessor;
    retField?: FlexibleMapAccessor;
}
