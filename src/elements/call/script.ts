import { XMLSchemaElementAttributes } from "../../types";
import { CdataTag } from "../cdata-tag";
import { TextTag } from "../text-tag";
import { CallerElement } from "./caller";
export class ScriptTag extends CallerElement {
    protected attributes = this.attributes as ScriptTagAttributes;
    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
        return;
    }

    public convert(): string[] {
        return this.attributes?.location || this.attributes?.script
            ? this.getInline()
            : this.convertChildren();
    }

    private getInline(): string[] {
        if (this.attributes.location) {
            this.setVariableToContext({ name: "context" });
            this.converter.addImport("ScriptUtil");
            return [
                `ScriptUtil.executeScript("${this.attributes.location}", null, context);`,
            ];
        } else if (this.attributes.script) {
            return new ScriptTextTag(
                {
                    type: "text",
                    text: this.attributes.script,
                },
                this.converter,
                this.parent
            ).convert();
        }
        return [];
    }
}

export interface ScriptTagAttributes extends XMLSchemaElementAttributes {
    location?: string;
    script?: string;
}

export class ScriptTextTag extends TextTag {}

export class ScriptCdataTag extends CdataTag {}
