import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "../assignment/setter";

export class SetServiceFields extends SetterElement {
    public static readonly TAG = "set-service-fields";
    protected attributes = this.attributes as SetServiceFieldsAttributes;

    public getType(): string | undefined {
        this.converter.addImport("Map");
        return "Map<String, Object>";
    }
    public getField(): string | undefined {
        return this.attributes["to-map"];
    }

    public convert(): string[] {
        this.setVariableToContext({ name: "dctx" });
        return this.wrapConvert(
            `dctx.makeValidContext(${this.getParameters()})`
        );
    }

    private getParameters(): string {
        return [
            `"${this.attributes["service-name"]}"`,
            `"${this.attributes.mode ?? "IN"}"`,
            ConvertUtils.parseFieldGetter(this.attributes.map) ??
                this.attributes.map,
        ].join(", ");
    }
}

interface SetServiceFieldsAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "map": string;
    "to-map": string;
    "mode"?: "IN" | "OUT";
}
