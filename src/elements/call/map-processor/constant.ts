import { MakeInStringBehaviour } from "../../../behavior/make-in-string";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";
import { TextTag } from "../../text-tag";

export class Constant extends ElementTag implements MakeInStringBehaviour {
    public static readonly TAG = "constant";
    protected attributes = this.attributes as ConstantAttributes;

    public convert(): string[] {
        this.converter.appendMessage(
            "ERROR",
            "Method not implemented.",
            this.position
        );
        return [];
    }

    public convertMakeInStringOperation(
        mapName: string,
        fieldName: string
    ): string[] {
        return this.convertChildren();
    }
}

interface ConstantAttributes extends XMLSchemaElementAttributes {}

export class ConstantTextTag extends TextTag {
    public convert(): string[] {
        return [
            `"${this.tag.text.replace(/"/g, `\\"`).replace(/\n/g, `\\n`)}"`,
        ];
    }
}
