import { Logging, LoggingAttributes } from "./logging";

export class Log extends Logging {
    public static readonly TAG = "log";
    protected attributes = this.attributes as LogAttributes;

    public convert(): string[] {
        this.converter.addImport("Debug");
        return [
            `Debug.log(${this.getDebugLevel()}, null, ${this.converter.parseValue(
                this.attributes.message
            )}, this.getClass().getName());`,
        ];
    }
}

interface LogAttributes extends LoggingAttributes {
    message: string;
}
