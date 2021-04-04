import ConvertUtils from "../../core/convert-utils";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class Now extends SetterElement {
    protected getField(): string {
        return this.attributes.field;
    }

    protected attributes = this.attributes as NowAttributes;

    private getAssigned(): string {
        switch (this.attributes.type) {
            case "java.lang.Long":
                return "System.currentTimeMillis()";

            case "java.sql.Date":
                this.converter.addImport("LocalDate");
                this.converter.addImport("java.sql.Date");
                return "Date.valueOf(LocalDate.now())";

            case "java.sql.Time":
                this.converter.addImport("LocalTime");
                this.converter.addImport("java.sql.Time");
                return "Time.valueOf(LocalTime.now())";

            case "java.util.Date":
                this.converter.addImport("LocalDate");
                this.converter.addImport("java.util.Date");
                return "java.util.Date.valueOf(LocalDate.now())";

            case "java.sql.Timestamp":
            default:
                this.converter.addImport("LocalDateTime");
                this.converter.addImport("Timestamp");
                return "Timestamp.valueOf(LocalDateTime.now())";
        }
    }
    protected getType(): string {
        if (this.attributes.type) {
            return ConvertUtils.unqualify(this.attributes.type) ?? "Timestamp";
        }
        return "Timestamp";
    }

    public convert(): string[] {
        return [...this.wrapConvert(this.getAssigned())];
    }
}

interface NowAttributes extends BaseSetterAttributes {
    type?:
        | "java.lang.Long"
        | "java.sql.Date"
        | "java.sql.Time"
        | "java.sql.Timestamp"
        | "java.util.Date";
}
