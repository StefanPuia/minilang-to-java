import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export abstract class Logging extends ElementTag {
    protected attributes = this.attributes as LoggingAttributes;
    
}

export interface LoggingAttributes extends XMLSchemaElementAttributes {
    level:
        | "info"
        | "verbose"
        | "timing"
        | "important"
        | "warning"
        | "error"
        | "fatal"
        | "always";
}