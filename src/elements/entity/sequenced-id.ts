import { ValidationMap } from "../../core/validate";
import { StringBoolean } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "../assignment/setter";

export class SequencedId extends SetterElement {
    public static readonly TAG = "sequenced-id";
    protected attributes = this.attributes as SequenceIdAttributes;

    public getType(): string {
        return "String";
    }
    public getField(): string {
        return this.attributes.field;
    }
    public convert(): string[] {
        this.setVariableToContext({ name: "delegator" });
        return this.wrapConvert(
            `delegator.getNextSeqId("${this.attributes["sequence-name"]}")`
        );
    }

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["get-long-only", "delegator-name", "stagger-max"],
        };
    }
}

interface SequenceIdAttributes extends BaseSetterRawAttributes {
    "sequence-name": string;
    "stagger-max"?: string;
    "get-long-only"?: StringBoolean;
    "delegator-name"?: string;
}
