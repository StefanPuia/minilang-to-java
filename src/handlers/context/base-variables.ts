import { Converter } from "../../core/converter";
import { VariableContext } from "../../types";
import { ContextVariable } from "./variables/context-variable";

export abstract class BaseVariableHandler {
    protected readonly context: VariableContext;
    protected readonly converter: Converter;
    public abstract getVariables(): ContextVariable[];

    constructor(context: VariableContext, converter: Converter) {
        this.context = context;
        this.converter = converter;
    }
}
