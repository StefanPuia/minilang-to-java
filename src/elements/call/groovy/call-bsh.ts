import { XMLSchemaElementAttributes } from "../../../types";
import { GroovySnippet } from "./groovy-snippet";

export class CallBsh extends GroovySnippet {
    public static readonly TAG = "call-bsh";
    protected attributes = this.attributes as CallBshAttributes;
    protected getLocation(): string | undefined {
        return this.attributes?.resource;
    }
}

interface CallBshAttributes extends XMLSchemaElementAttributes {
    resource?: string;
}
