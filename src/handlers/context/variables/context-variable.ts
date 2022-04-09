import { Converter } from "../../../core/converter";
import { MethodMode, VariableContext } from "../../../types";

export abstract class ContextVariable {
    private readonly converter: Converter;
    private readonly context: VariableContext;
    private readonly assignTo?: string;

    constructor(
        converter: Converter,
        context: VariableContext,
        assignTo?: string
    ) {
        this.converter = converter;
        this.context = context;
        this.assignTo = assignTo;
    }

    public abstract getName(): string;

    public abstract getType(): string;

    private isUsed() {
        return (this.context[this.getName()]?.count ?? 0) > 0;
    }

    public getParameterDeclaration(final: boolean = true): string | undefined {
        if (!this.isUsed()) {
            return;
        }
        return [final ? "final" : "", this.getType(), this.getName()].join(" ");
    }

    public getBodyDeclaration(final: boolean = true): string[] {
        switch (this.converter.getMethodMode()) {
            case MethodMode.GENERIC:
                return this.getUtilBodyDeclaration(final);
            default:
                return this.getDefaultBodyDeclaration(final);
        }
    }

    protected getDefaultBodyDeclaration(final: boolean): string[] {
        if (!this.isUsed()) {
            return [];
        }
        return [
            [
                `${[final ? "final" : "", this.getType(), this.getName()].join(
                    " "
                )}`,
                ...(this.assignTo ? [` = ${this.assignTo}`] : []),
                ";",
            ].join(""),
        ];
    }

    protected getUtilBodyDeclaration(final: boolean): string[] {
        return [];
    }
}
