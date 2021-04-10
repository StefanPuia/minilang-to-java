import { XMLSchemaElementAttributes } from "../../types";
import { ScriptTag, ScriptTagAttributes } from "./script";

export class CallBsh extends ScriptTag {
    protected attributes = {
        location: this.attributes?.resource,
    } as ScriptTagAttributes;
}

interface CallBshAttributes extends XMLSchemaElementAttributes {
    resource?: string;
}
