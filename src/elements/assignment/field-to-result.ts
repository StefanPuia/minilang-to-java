import ConvertUtils from "../../core/convert-utils";
import { MethodMode } from "../../types";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class FieldToResult extends SetterElement {
    public static readonly TAG = "field-to-result";
    protected attributes = this.attributes as FieldToResultAttribute;

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map";
    }

    public getField(): string | undefined {
        this.setVariableToContext({name: this.converter.getReturnVariable()});
        return `${this.converter.getReturnVariable()}.${
            this.attributes["result-name"] ?? this.attributes.field
        }`;
    }

    public convert(): string[] {
        return this.wrapConvert(
            ConvertUtils.parseFieldGetter(this.attributes.field) ?? this.attributes.field
        );
    }

    public wrapConvert(assign: string): string[] {
        if (![MethodMode.SERVICE, MethodMode.EVENT].includes(this.converter.getMethodMode())) {
            this.converter.appendMessage(
                "ERROR",
                `"${this.getTagName()}" used in a non-service or non-event environment`
            );
        }

        return [...super.wrapConvert(assign)];
    }
}

interface FieldToResultAttribute extends BaseSetterAttributes {
    "result-name"?: string;
}
