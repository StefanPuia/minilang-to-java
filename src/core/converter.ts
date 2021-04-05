import { BaseErrorHandler } from "../handlers/error/base-error";
import { MethodMode } from "../types";
import ConvertUtils from "./convert-utils";
import { ElementFactory } from "./element-factory";

export class Converter {
    private readonly source: string;
    private readonly methodMode: MethodMode;
    private tabSize: number = 4;
    private imports: Set<string> = new Set();
    private errors: Message[] = [];
    private warnings: Message[] = [];
    private readonly errorHandler: BaseErrorHandler = new BaseErrorHandler();

    private constructor(source: string, mode: MethodMode) {
        this.source = source;
        this.methodMode = mode;
    }

    private convert() {
        const parsed = ConvertUtils.parseXML(this.source);
        const converted = parsed.elements
            .map((parsed) => ElementFactory.parse(parsed, this)?.convert().join("\n") ?? "")
            .join("\n");
        return [
            this.getImports(),
            this.newLine(),
            converted,
            this.newLine(),
            this.getErrors(),
            this.getWarnings(),
        ]
            .filter(Boolean)
            .join("\n");
    }

    private newLine() {
        return "\n";
    }

    private getErrors() {
        return this.errors.map(({ content }) => `// FIXME: ERROR: ${content}`).join("\n");
    }

    private getWarnings() {
        return this.warnings.map(({ content }) => `// WARNING: ${content}`).join("\n");
    }

    private getImports() {
        return Array.from(this.imports)
            .sort()
            .map((classPath) => `import ${classPath};`)
            .join("\n");
    }

    public static convert(source: string, mode: MethodMode) {
        return new Converter(source, mode).convert();
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
            const qualified = ConvertUtils.qualify(classPath) ?? classPath;
            if (!this.imports.has(qualified)) {
                if (qualified.indexOf(".") === -1) {
                    this.appendMessage("WARNING", `No import mapped for "${qualified}"`);
                }
                this.imports.add(qualified);
            }
        }
    }

    public getErrorHandler() {
        return this.errorHandler;
    }

    public getMethodMode() {
        return this.methodMode;
    }

    public getReturnVariable() {
        switch (this.methodMode) {
            case MethodMode.EVENT:
                return "request";
            default:
            case MethodMode.SERVICE:
                return "_returnMap";
        }
    }
}

interface Message {
    content: string;
    line?: string;
    lineNumber?: number;
}
