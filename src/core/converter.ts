import { NEWLINE } from "../consts";
import { BaseVariableHandler } from "../handlers/context/base-variables";
import { BaseErrorHandler } from "../handlers/error/base-error";
import { ErrorHandlerFactory } from "../handlers/error/error-handler-factory";
import {
    ConvertConfig,
    ConverterInit,
    MessageType,
    MethodMode,
    Position,
} from "../types";
import { ElementFactory } from "./element-factory";
import ConvertUtils from "./utils/convert-utils";
import { qualify } from "./utils/import-utils";
import { parseXML } from "./utils/xml-utils";

export class Converter {
    private readonly source: string;
    private readonly methodMode: MethodMode;
    private readonly className?: string;
    private tabSize: number = 4;
    private imports: Set<string> = new Set();
    private staticImports: Set<string> = new Set();
    private messages: Message[] = [];
    private errorHandler: BaseErrorHandler | undefined;
    private contextVariableHandler: BaseVariableHandler | undefined;
    private loggingConfig: Record<MessageType, boolean>;
    public readonly config: ConvertConfig;

    private constructor(init: ConverterInit) {
        this.source = init.source;
        this.methodMode = init.methodMode;
        this.className = init.className;
        this.loggingConfig = {
            ERROR: true,
            WARNING: init.logging.warning ?? true,
            DEPRECATE: init.logging.deprecated ?? true,
            INFO: init.logging.info ?? true,
        };
        this.config = {
            authenticateServicesAutomatically:
                init.converter.authServices ?? false,
            replicateMinilang: init.converter.replicateMinilang ?? false,
        };
    }

    private convert() {
        const start = new Date().getTime();
        const parsed = parseXML(this.source);
        const converted = ElementFactory.parseWithRoot(parsed, this);
        const lines = [
            this.getPackageName(),
            NEWLINE,
            this.getImports(
                this.imports,
                (className) => `import ${className};`
            ),
            NEWLINE,
            this.getImports(
                this.staticImports,
                (className) => `import static ${className};`
            ),
            NEWLINE,
            ...converted,
            NEWLINE,
        ].filter(Boolean);
        this.appendParseStats(start);

        return [...lines, ...this.getDisplayMessages()]
            .join(NEWLINE)
            .replace(/\n{3,}/g, NEWLINE.repeat(2));
    }

    private getDisplayMessages(): string[] {
        return this.messages
            .filter(({ type }) => this.loggingConfig[type])
            .map(({ content, position, type }) =>
                `// ${type}: ${content} ${this.getLineCol(position)}`.trim()
            );
    }

    private appendParseStats(start: number) {
        const end = new Date().getTime();
        const timing = (end - start) / 1000;
        const timingLine = `Finished parsing ${
            this.source.split(NEWLINE).length
        } lines in ${timing.toFixed(3)} seconds.`;
        this.appendMessage(timing < 0.2 ? "INFO" : "WARNING", timingLine);
    }

    public getLineCol(position?: Position): string {
        if (position) {
            const { line, column } = position;
            return `${line + 1}:${column + 1}`;
        }
        return "";
    }

    private getImports(
        imports: Set<string>,
        mapper: (className: string) => string
    ) {
        return Array.from(imports).sort().map(mapper).join(NEWLINE);
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
        return [`package ${packageName || "com.minilang.to.java"};`];
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

    public addStaticImport(className: string, field: string) {
        const qualified = qualify(className) ?? className;
        this.staticImports.add(`${qualified}.${field}`);
    }

    public addImport(type?: string) {
        if (!type || ConvertUtils.isPrimitiveType(type)) {
            return;
        }
        const qualified = qualify(type) ?? type;
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

    public getErrorHandler() {
        if (!this.errorHandler) {
            this.errorHandler = ErrorHandlerFactory.getHandler(this);
        }
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
}

interface Message {
    type: MessageType;
    content: string;
    line?: string;
    position?: Position;
}
