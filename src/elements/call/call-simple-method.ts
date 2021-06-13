import { ValidationMap } from "../../core/validate";
import { FlexibleLocation, XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "../assignment/setter";
import { ResultToField } from "./result-to/result-to-field";

export class CallSimpleMethod extends SetterElement {
    public static readonly TAG = "call-simple-method";
    protected attributes = this.attributes as CallSimpleMethodRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["method-name", "xml-resource", "scope"],
            requiredAttributes: ["method-name"],
            constantAttributes: ["method-name", "xml-resource", "scope"],
            childElements: ["result-to-field"],
        };
    }

    private getAttributes(): CallSimpleMethodAttributes {
        return {
            methodName: this.attributes["method-name"],
            xmlResource: this.attributes["xml-resource"],
            scope: this.attributes.scope ?? "function",
        };
    }

    public getType(): string {
        this.converter.addImport("Map");
        return "Map<String, Object>";
    }
    public getField(): string {
        return `${this.getAttributes().methodName}Result`;
    }
    public convert(): string[] {
        const results = this.getResults();
        if (results.length && this.getAttributes().scope !== "function") {
            this.converter.appendMessage(
                "ERROR",
                "Inline scope cannot include <result-to-field> elements.",
                this.position
            );
        }
        return [
            `// Called simple method "${this.getAttributes().methodName}" in ${
                this.getAttributes().xmlResource ?? "same file"
            }`,
            ...this.wrapConvert(`${this.getAttributes().methodName}()`),
            ...results,
        ];
    }

    private getResults(): string[] {
        return this.parseChildren()
            .filter((el) => el.getTagName() === "result-to-field")
            .map((el) => {
                (el as ResultToField).setFromField(this.getField());
                return el.convert();
            })
            .flat();
    }
}

interface CallSimpleMethodRawAttributes extends XMLSchemaElementAttributes {
    "method-name": string;
    "xml-resource"?: string;
    "scope"?: "inline" | "function";
}

interface CallSimpleMethodAttributes {
    methodName: string;
    xmlResource?: FlexibleLocation;
    scope: "inline" | "function";
}
