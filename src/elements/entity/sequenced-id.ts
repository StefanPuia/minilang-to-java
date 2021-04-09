import { StringBoolean } from "../../types";
import { BaseSetterAttributes, SetterElement } from "../assignment/setter";

export class SequencedId extends SetterElement {
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

    protected getUnsupportedAttributes() {
        return ["get-long-only", "delegator-name", "stagger-max"];
    }
}

interface SequenceIdAttributes extends BaseSetterAttributes {
    "sequence-name": string;
    "stagger-max"?: string;
    "get-long-only"?: StringBoolean;
    "delegator-name"?: string;
}
