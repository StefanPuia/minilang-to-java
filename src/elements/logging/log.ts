import { ValidationMap } from "../../core/validate";
import {
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { Logging } from "./logging";

export class Log extends Logging {
    public static readonly TAG = "log";
    protected attributes = this.attributes as LogRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["level", "message"],
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
            requiredAttributes: ["level", "message"],
            constantAttributes: ["level"],
            constantPlusExpressionAttributes: ["message"],
            noChildElements: true,
        };
    }

    private getAttributes(): LogAttributes {
        const { message, level } = this.attributes;
        return {
            message,
            level: this.getDebugLevel(level),
        };
    }

    public convert(): string[] {
        this.converter.addImport("Debug");
        return [
            `Debug.log(${
                this.getAttributes().level
            }, null, ${this.converter.parseValue(
                this.attributes.message
            )}, this.getClass().getName());`,
        ];
    }
}

interface LogRawAttributes extends XMLSchemaElementAttributes {
    message: string;
    level: string;
}

interface LogAttributes {
    message: FlexibleStringExpander;
    level: string;
}
