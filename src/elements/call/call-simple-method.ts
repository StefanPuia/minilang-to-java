import { XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "../assignment/setter";
import { ResultToField } from "./result-to/result-to-field";

export class CallSimpleMethod extends SetterElement {
    public static readonly TAG = "call-simple-method";
    protected attributes = this.attributes as CallSimpleMethodAttributes;

    public getType(): string {
        this.converter.addImport("Map");
        return "Map<String, Object>";
    }
    public getField(): string {
        return `${this.attributes["method-name"]}Result`;
    }
    public convert(): string[] {
        return [
            `// Called simple method "${this.attributes["method-name"]}" in ${
                this.attributes["xml-resource"] ?? "same file"
            }`,
            ...this.wrapConvert(`${this.attributes["method-name"]}()`),
            ...this.getResults(),
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

interface CallSimpleMethodAttributes extends XMLSchemaElementAttributes {
    "method-name": string;
    "xml-resource"?: string;
    "scope"?: "inline" | "function";
}
