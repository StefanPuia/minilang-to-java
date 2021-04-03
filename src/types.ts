export type StringBoolean = "true" | "false";

export interface XMLSchema {
    declaration: string;
    elements: XMLSchemaAnyElement[];
}

export type XMLSchemaAnyElement = XMLSchemaElement | XMLSchemaCommentElement;

export interface XMLSchemaCommentElement {
    type: "comment";
    comment: string;
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

export type VariableContext = string[];

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
