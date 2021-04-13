import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export abstract class Logging extends ElementTag {
    protected attributes = this.attributes as LoggingAttributes;

    protected getDebugLevel(): string {
        return {
            info: "Debug.INFO",
            verbose: "Debug.VERBOSE",
            timing: "Debug.TIMING",
            important: "Debug.IMPORTANT",
            warning: "Debug.WARNING",
            error: "Debug.ERROR",
            fatal: "Debug.FATAL",
            always: "Debug.ALWAYS",
        }[this.attributes.level ?? "info"];
    }
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
