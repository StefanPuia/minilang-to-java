import { ElementTag } from "../element-tag";

export abstract class Logging extends ElementTag {
    protected getDebugLevel(level?: string): string {
        return (
            {
                info: "Debug.INFO",
                verbose: "Debug.VERBOSE",
                timing: "Debug.TIMING",
                important: "Debug.IMPORTANT",
                warning: "Debug.WARNING",
                error: "Debug.ERROR",
                fatal: "Debug.FATAL",
                always: "Debug.ALWAYS",
            }[level ?? "info"] ?? this.getDebugLevel("info")
        );
    }
}
export type LoggingLevel =
    | "info"
    | "verbose"
    | "timing"
    | "important"
    | "warning"
    | "error"
    | "fatal"
    | "always";
