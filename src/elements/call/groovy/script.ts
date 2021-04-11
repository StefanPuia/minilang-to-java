import { XMLSchemaElementAttributes } from "../../../types";
import { CdataTag } from "../../cdata-tag";
import { TextTag } from "../../text-tag";
import { GroovySnippet } from "./groovy-snippet";

export class ScriptTag extends GroovySnippet {
    public static readonly TAG = "script";
    protected attributes = this.attributes as ScriptTagAttributes;

    protected getScript(): string | undefined {
        return this.attributes?.script;
    }
    protected getLocation(): string | undefined {
        return this.attributes?.location;
    }
}

export interface ScriptTagAttributes extends XMLSchemaElementAttributes {
    location?: string;
    script?: string;
}

export class ScriptTextTag extends TextTag {}

export class ScriptCdataTag extends CdataTag {}
