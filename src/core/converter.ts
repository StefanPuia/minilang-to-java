import { NEWLINE } from "../consts";
import { BaseVariableHandler } from "../handlers/context/base-variables";
import { ContextVariableFactory } from "../handlers/context/context-variable-factory";
import { BaseErrorHandler } from "../handlers/error/base-error";
import { ErrorHandlerFactory } from "../handlers/error/error-handler-factory";
import { ConverterInit, MessageType, MethodMode, Position } from "../types";
import ConvertUtils from "./utils/convert-utils";
import { ElementFactory } from "./element-factory";
import { parseXML } from "./utils/xml-utils";
import { qualify } from "./utils/import-utils";

export class Converter {
    private readonly source: string;
    private readonly methodMode: MethodMode;
    private readonly className?: string;
    private tabSize: number = 4;
    private imports: Set<string> = new Set();
    private messages: Message[] = [];
    private errorHandler: BaseErrorHandler | undefined;
    private contextVariableHandler: BaseVariableHandler | undefined;
    private loggingConfig: Record<MessageType, boolean>;

    private constructor(init: ConverterInit) {
        this.source = init.source;
        this.methodMode = init.methodMode;
        this.className = init.className;
        this.loggingConfig = {
            ERROR: true,
            WARNING: true,
            DEPRECATE: true,
            INFO: true,
            ...init.logging,
        };
    }

    private convert() {
        const start = new Date().getTime();
        const parsed = parseXML(this.source);
        const converted = ElementFactory.parseWithRoot(parsed, this);
        const lines = [
            this.getPackageName(),
            this.getImports(),
            NEWLINE,
            ...converted,
            NEWLINE,
        ].filter(Boolean);
        this.appendMessage(
            "INFO",
            this.getParseStats(this.source, start, new Date().getTime())
        );

        return [...lines, ...this.getDisplayMessages()].join(NEWLINE);
    }

    private getDisplayMessages(): string[] {
        return this.messages
            .filter(({ type }) => this.loggingConfig[type])
            .map(({ content, position, type }) =>
                `// ${type}: ${content} ${this.getLineCol(position)}`.trim()
            );
    }

    private getParseStats(source: string, start: number, end: number): string {
        return `Finished parsing ${source.split(NEWLINE).length} lines in ${(
            (end - start) /
            1000
        ).toFixed(3)} seconds.`;
    }

    public getLineCol(position?: Position): string {
        if (position) {
            const { line, column } = position;
            return `${line + 1}:${column + 1}`;
        }
        return "";
    }

    private getImports() {
        return Array.from(this.imports)
            .sort()
            .map((classPath) => `import ${classPath};`)
            .join(NEWLINE);
    }

    private extractClassIdentifiers(): [
        packageName?: string,
        className?: string
    ] {
        if (this.className) {
            const matches = this.className.match(
                /^(?<packageName>.*?)\.?(?<className>\w+)$/
            )?.groups;
            return [matches?.packageName, matches?.className];
        }
        return [];
    }

    private getPackageName(): string[] {
        const [packageName] = this.extractClassIdentifiers();
        return [`package ${packageName || "com.minilang.to.java"};${NEWLINE}`];
    }

    public getClassName(): string {
        const [, className] = this.extractClassIdentifiers();
        return className || "Foo";
    }

    public static convert(init: ConverterInit) {
        return new Converter(init).convert();
    }

    public getIndentSpaces() {
        return " ".repeat(this.tabSize);
    }

    public appendMessage(
        type: MessageType,
        message: string,
        position?: Position,
        line?: string
    ) {
        this.messages.push({
            type,
            content: message,
            line,
            position,
        });
    }

    public addImport(classPath?: string) {
        if (classPath) {
            if (
                ["int", "boolean", "long", "double", "char"].includes(classPath)
            ) {
                return;
            }
            const qualified = qualify(classPath) ?? classPath;
            if (qualified.startsWith("java.lang.")) {
                return;
            }
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
            this.contextVariableHandler =
                ContextVariableFactory.getHandler(this);
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
        const scriptMatch = value.match(
            /^\$\{\s*(?:groovy:)?\s*(?<script>.+)\}$/
        );
        if (scriptMatch) {
            return scriptMatch?.groups?.script as string;
        }
        if (value.includes('"') || value.includes("(")) {
            return value;
        }
        if (!isNaN(parseFloat(value))) {
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
            case "BigDecimal":
                this.addImport("BigDecimal");
                return `new BigDecimal(${
                    (value && this.parseValue(value)) || value
                })`;
        }
        if (value) return this.parseValue(value);
    }

    public guessFieldType(field: string, val?: any) {
        const value = ConvertUtils.stripQuotes(val);
        if (field.startsWith("is") || field.startsWith("has")) {
            if (value) {
                if (["true", "false"].includes(value) || value.includes("(")) {
                    return "boolean";
                }
                return "String";
            }
            return "boolean";
        }
    }
}

interface Message {
    type: MessageType;
    content: string;
    line?: string;
    position?: Position;
}
