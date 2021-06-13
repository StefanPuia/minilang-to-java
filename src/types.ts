export type StringBoolean = "true" | "false";

export interface XMLSchema {
    declaration: string;
    elements: XMLSchemaAnyElement[];
}

export type XMLSchemaAnyElement =
    | XMLSchemaElement
    | XMLSchemaCommentElement
    | XMLSchemaTextElement
    | XMLSchemaCdataElement;

export interface XMLSchemaCommentElement {
    type: "comment";
    comment: string;
}

export interface XMLSchemaTextElement {
    type: "text";
    text: string;
}

export interface XMLSchemaCdataElement {
    type: "cdata";
    cdata: string;
}

export interface XMLSchemaElement {
    type: "element";
    name: string;
    attributes: XMLSchemaElementAttributes;
    elements?: XMLSchemaAnyElement[];
    position?: Position;
}

export interface XMLSchemaElementAttributes {
    [name: string]: unknown;
}

export interface ValidChild {
    min: number;
    max: number;
}

export interface ValidChildren {
    [tag: string]: ValidChild;
}

export type ContextVariable = {
    name: string;
    count?: number;
    type?: string;
    typeParams: string[];
};
export type VariableContext = {
    [name: string]: ContextVariable;
};

export type Operator =
    | "equals"
    | "not-equals"
    | "less"
    | "less-equals"
    | "greater"
    | "greater-equals"
    | "contains"
    | "is-null"
    | "is-not-null"
    | "is-empty";

export enum MethodMode {
    GENERIC = "GENERIC",
    EVENT = "EVENT",
    SERVICE = "SERVICE",
}

export interface Position {
    line: number;
    column: number;
}

export type Constant = string;
export type FlexibleStringExpander = string;
export type FlexibleMapAccessor = string;
export type FlexibleServletAccessor = string;
export type FlexibleMessage = string;
export type FlexibleLocation = string;

export type JavaClassName = string;

export type MessageType = "ERROR" | "WARNING" | "INFO" | "DEPRECATE";

export interface ConverterInit {
    source: string,
    methodMode: MethodMode,
    packageName?: string,
    className?: string,
    logging: Partial<Record<MessageType, boolean>>
}