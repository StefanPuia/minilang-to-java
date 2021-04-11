import { BaseSetterAttributes, SetterElement } from "../assignment/setter";

export class Calculate extends SetterElement {
    public static readonly TAG = "calculate";
    protected attributes = this.attributes as CalculateAttributes;

    public getType(): string | undefined {
        return this.attributes.type ?? "BigDecimal";
    }
    public getField(): string | undefined {
        return this.attributes.field;
    }
    public convert(): string[] {
        this.converter.addImport("BigDecimal");
        this.converter.addImport(this.getType());

        const assign = [
            `new BigDecimal(${this.convertChildren().join(" + ") || '"0"'})`,
            `.setScale(${this.getScaleParams()})`,
            ...this.getToType(),
        ].join("");
        return this.wrapConvert(assign);
    }

    private getRoundingMode(): string[] {
        if (this.attributes["rounding-mode"]) {
            this.converter.addImport("RoundingMode");
            return [
                `RoundingMode.${this.attributes[
                    "rounding-mode"
                ].toUpperCase()}`,
            ];
        }
        return [];
    }

    private getScaleParams(): string {
        return [
            this.attributes["decimal-scale"] ?? "2",
            ...this.getRoundingMode(),
        ].join(", ");
    }

    private getToType(): string[] {
        switch (this.attributes.type) {
            case "String":
                return [".toString()"];
            case "Double":
                return [".doubleValue()"];
            case "Float":
                return [".floatValue()"];
            case "Long":
                return [".longValue()"];
            case "Integer":
                return [".intValue()"];
            case "BigDecimal":
            default:
                return [];
        }
    }
}

interface CalculateAttributes extends BaseSetterAttributes {
    "rounding-mode"?:
        | "Ceiling"
        | "Floor"
        | "Up"
        | "Down"
        | "HalfUp"
        | "HalfDown"
        | "HalfEven"
        | "Unnecessary";
    "decimal-scale"?: string;
    "decimal-format"?: string;
    "type"?: "String" | "Double" | "Float" | "Long" | "Integer" | "BigDecimal";
}
