import { DEFAULT_MAP_TYPE } from "../../consts";
import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor, MethodMode } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class FieldToResult extends SetterElement {
    public static readonly TAG = "field-to-result";
    protected attributes = this.attributes as FieldToResultRawAttributes;

    private getAttributes(): FieldToResultAttributes {
        return {
            "result-name": this.attributes.field,
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "result-name"],
            requiredAttributes: ["field"],
            expressionAttributes: ["field", "result-name"],
            noChildElements: true,
        };
    }

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return DEFAULT_MAP_TYPE;
    }

    public getField(): string | undefined {
        this.setVariableToContext({ name: this.converter.getReturnVariable() });
        return `${this.converter.getReturnVariable()}.${
            this.getAttributes()["result-name"]
        }`;
    }

    public convert(): string[] {
        return this.wrapConvert(
            ConvertUtils.parseFieldGetter(this.getAttributes().field) ??
                this.getAttributes().field
        );
    }

    public wrapConvert(assign: string): string[] {
        return [...super.wrapConvert(assign)];
    }
}

interface FieldToResultRawAttributes extends BaseSetterRawAttributes {
    "result-name"?: string;
}

interface FieldToResultAttributes {
    "field": FlexibleMapAccessor;
    "result-name": FlexibleMapAccessor;
}
