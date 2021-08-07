import { ValidationMap } from "../../core/validate";
import { XMLSchemaElementAttributes } from "../../types";
import { Logging } from "./logging";

export class Trace extends Logging {
    public static readonly TAG = "trace";
    protected attributes = this.attributes as TraceRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["level"],
            constantAttributes: ["level"],
            attributeValues: [
                {
                    name: "level",
                    values: [
                        "info",
                        "verbose",
                        "timing",
                        "important",
                        "warning",
                        "error",
                        "fatal",
                        "always",
                    ],
                },
            ],
        };
    }
    private getAttributes(): TraceAttributes {
        const { level } = this.attributes;
        return {
            level: this.getDebugLevel(level),
        };
    }

    public convert(): string[] {
        return [
            `// Begin trace log (level = ${this.getAttributes().level})`,
            ...this.convertChildren(),
            "// End trace log",
        ];
    }
}

interface TraceRawAttributes extends XMLSchemaElementAttributes {
    message: string;
    level: string;
}

interface TraceAttributes {
    level: string;
}
