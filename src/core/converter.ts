import ConvertUtils from "./convert-utils";
import { ElementFactory } from "./element-factory";

export class Converter {
    private readonly source: string;
    private tabSize: number = 4;
    private imports: Set<string> = new Set();
    private errors: Message[] = [];
    private warnings: Message[] = [];

    private constructor(source: string) {
        this.source = source;
    }

    private convert() {
        const parsed = ConvertUtils.parseXML(this.source);
        const converted = parsed.elements
            .map((parsed) => ElementFactory.parse(parsed, this)?.convert().join("\n") ?? "")
            .join("\n");
        return [this.getImports(), converted, this.getErrors(), this.getWarnings()]
            .filter(Boolean)
            .join("\n");
    }

    private getErrors() {
        return this.errors.map(({ content }) => `// FIXME: ERROR: ${content}`).join("\n");
    }

    private getWarnings() {
        return this.warnings.map(({ content }) => `// WARNING: ${content}`).join("\n");
    }

    private getImports() {
        return Array.from(this.imports).sort()
            .map((classPath) => `import ${classPath};`)
            .join("\n");
    }

    public static convert(source: string) {
        return new Converter(source).convert();
    }

    public getIndentSpaces() {
        return " ".repeat(this.tabSize);
    }

    public appendMessage(
        type: "ERROR" | "WARNING",
        message: string,
        line?: string,
        lineNumber?: number
    ) {
        (type === "ERROR" ? this.errors : this.warnings).push({
            content: message,
            line,
            lineNumber,
        });
    }

    public addImport(classPath?: string) {
        if (classPath) {
            this.imports.add(ConvertUtils.qualify(classPath) ?? classPath);
        }
    }
}

interface Message {
    content: string;
    line?: string;
    lineNumber?: number;
}
