import { Logging, LoggingAttributes } from "./logging";

export class Log extends Logging {
    public static readonly TAG = "log";
    protected attributes = this.attributes as LogAttributes;

    public convert(): string[] {
        this.converter.addImport("Debug");
        return [
            `Debug.${this.getMethod()}(${this.converter.parseValue(
                this.attributes.message
            )});`,
        ];
    }

    private getMethod() {
        const level = this.attributes.level ?? "fatal";
        return `log${level.charAt(0).toUpperCase()}${level.slice(1)}`;
    }
}

interface LogAttributes extends LoggingAttributes {
    message: string;
}
