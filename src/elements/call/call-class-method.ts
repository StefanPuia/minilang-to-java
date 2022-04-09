import { unqualify } from "../../core/utils/import-utils";
import { guessFieldType } from "../../core/utils/type-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, XMLSchemaElementAttributes } from "../../types";
import { CallerElement } from "./caller";

export class CallClassMethod extends CallerElement {
    public static readonly TAG = "call-class-method";
    protected attributes = this.attributes as CallClassMethodRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["class-name", "method-name", "ret-field"],
            constantAttributes: ["class-name", "method-name"],
            requiredAttributes: ["class-name", "method-name"],
            childElements: ["string", "field"],
        };
    }

    private getAttributes(): CallClassMethodAttributes {
        return {
            className: this.attributes["class-name"],
            methodName: this.attributes["method-name"],
            retField: this.attributes["ret-field"],
        };
    }

    public getType() {
        return guessFieldType(this.getField());
    }

    public getField(): string | undefined {
        return this.getAttributes().retField;
    }

    public convert(): string[] {
        this.converter.appendMessage(
            "DEPRECATE",
            "<call-class-method> element is deprecated (use <script>)",
            this.position
        );
        this.converter.addImport(this.getAttributes().className);
        return this.wrapConvert(
            `${unqualify(this.getAttributes().className)}.${
                this.getAttributes().methodName
            }(${this.getFields()})`
        );
    }
}

interface CallClassMethodRawAttributes extends XMLSchemaElementAttributes {
    "class-name": string;
    "method-name": string;
    "ret-field"?: string;
}

interface CallClassMethodAttributes {
    className: string;
    methodName: string;
    retField?: FlexibleMapAccessor;
}
