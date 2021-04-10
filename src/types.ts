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
    count: number;
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
    GENERIC,
    EVENT,
    SERVICE,
}
