import { ValidationMap } from "../../core/validate";
import { EntityElement, EntityElementAttributes } from "./entity";

export class MakeValue extends EntityElement {
    public static readonly TAG = "make-value";
    protected attributes = this.attributes as MakeValueAttributes;

    public getValidation(): ValidationMap {
        return {
            unhandledAttributes: ["delegator-name"],
        };
    }

    public getType(): string | undefined {
        this.converter.addImport("GenericValue");
        return "GenericValue";
    }
    public getField(): string | undefined {
        return this.attributes["value-field"];
    }
    public convert(): string[] {
        const map = this.attributes.map ? `, ${this.attributes.map}` : "";
        return this.wrapConvert(
            `delegator.makeValue("${this.attributes["entity-name"]}"${map})`
        );
    }
}

interface MakeValueAttributes extends EntityElementAttributes {
    "value-field": string;
    "map"?: string;
}
