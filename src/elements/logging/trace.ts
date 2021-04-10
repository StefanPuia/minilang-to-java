import { Logging } from "./logging";

export class Trace extends Logging {
    public convert(): string[] {
        return [
            `// Begin trace log (level = ${this.attributes.level})`,
            ...this.convertChildren(),
            "// End trace log",
        ];
    }
}
