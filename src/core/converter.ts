import { BaseErrorHandler } from "../handlers/error/base-error";
import { ErrorHandlerFactory } from "../handlers/error/error-handler-factory";
import { MethodMode } from "../types";
import ConvertUtils from "./convert-utils";
import { ElementFactory } from "./element-factory";
import { BaseVariableHandler } from '../handlers/context/base-variables';
import { ContextVariableFactory } from "../handlers/context/context-variable-factory";

export class Converter {
    private readonly source: string;
    private readonly methodMode: MethodMode;
    private tabSize: number = 4;
    private imports: Set<string> = new Set();
    private errors: Message[] = [];
    private warnings: Message[] = [];
    private errorHandler: BaseErrorHandler | undefined;
    private contextVariableHandler: BaseVariableHandler | undefined;

    private constructor(source: string, mode: MethodMode) {
        this.source = source;
        this.methodMode = mode;
    }

    private convert() {
        const parsed = ConvertUtils.parseXML(this.source);
        const converted = ElementFactory.parseWithRoot(parsed, this);
        return [
            this.getImports(),
            this.newLine(),
            ...converted,
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
        return this.errors
            .map(({ content }) => `// FIXME: ERROR: ${content}`)
            .join("\n");
    }

    private getWarnings() {
        return this.warnings
            .map(({ content }) => `// WARNING: ${content}`)
            .join("\n");
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
                    this.appendMessage(
                        "WARNING",
                        `No import mapped for "${qualified}"`
                    );
                }
                this.imports.add(qualified);
            }
        }
    }

    public getErrorHandler() {
        if (!this.errorHandler) {
            this.errorHandler = ErrorHandlerFactory.getHandler(this);
        }
        return this.errorHandler;
    }

    public getContextVariableHandler() {
        if (!this.contextVariableHandler) {
            this.contextVariableHandler = ContextVariableFactory.getHandler(this);
        }
        return this.contextVariableHandler;
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

    public parseValue(val: string): string {
        const value = ConvertUtils.stripQuotes(val);
        if (!value) return "null";
        switch (value) {
            case "null":
                return "null";
            case "NewList":
                this.addImport("ArrayList");
                return "new ArrayList<>()";
            case "NewMap":
                this.addImport("HashMap");
                return "new HashMap<>()";
        }
        const scriptMatch = value.match(/^\$\{\s*groovy:(?<script>.+)\}$/);
        if (scriptMatch) {
            return scriptMatch?.groups?.script as string;
        }
        if (value.includes('"') || value.includes("(")) {
            return value;
        }
        return `"${value}"`;
    }

    public parseValueOrInitialize(
        type?: string,
        value?: string
    ): string | undefined {
        switch (type) {
            case "List":
                this.addImport("ArrayList");
                return "new ArrayList<>()";
            case "Boolean":
                if (value && ["true", "false"].includes(value)) {
                    return value;
                }
                break;
        }
        if (value) return this.parseValue(value);
    }

    public guessFieldType(field: string, val?: any) {
        const value = ConvertUtils.stripQuotes(val);
        if (field.startsWith("is") || field.startsWith("has")) {
            if (value) {
                if (["true", "false"].includes(value)) {
                    return "Boolean";
                }
                return "String";
            }
            return "Boolean";
        }
    }
}

interface Message {
    content: string;
    line?: string;
    lineNumber?: number;
}
