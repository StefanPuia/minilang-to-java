import ConvertUtils from "../../core/convert-utils";
import { ValidationMap } from "../../core/validate";
import { FlexibleMapAccessor } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

abstract class BaseNow extends SetterElement {
    protected attributes = this.attributes as NowRawAttributes;

    protected getAttributes(): NowAttributes {
        return {
            type: "java.sql.Timestamp",
            ...this.attributes,
        };
    }

    public getField(): string {
        return this.getAttributes().field;
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["field", "type"],
            requiredAttributes: ["field"],
            expressionAttributes: ["field"],
            constantAttributes: ["type"],
            noChildElements: true,
        };
    }

    protected getAssignedByType(type: JavaNowType): string {
        switch (type) {
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
                this.converter.addImport("LocalDateTime");
                this.converter.addImport("Timestamp");
                return "Timestamp.valueOf(LocalDateTime.now())";
        }
    }

    public getType(): string {
        return ConvertUtils.unqualify(this.getAttributes().type);
    }

    protected getAssigned(): string {
        return this.getAssignedByType(this.getAttributes().type);
    }

    public convert(): string[] {
        return [...this.wrapConvert(this.getAssigned())];
    }
}

type JavaNowType =
    | "java.lang.Long"
    | "java.sql.Date"
    | "java.sql.Time"
    | "java.sql.Timestamp"
    | "java.util.Date";

interface NowRawAttributes extends BaseSetterRawAttributes {
    type?: JavaNowType;
}

interface NowAttributes {
    field: FlexibleMapAccessor;
    type: JavaNowType;
}

export class Now extends BaseNow {
    public static readonly TAG = "now";
}

abstract class DeprecatedNow extends BaseNow {
    public getValidation() {
        this.converter.appendMessage(
            "DEPRECATE",
            `"${this.getTagName()}" deprecated - use <now>`,
            this.position
        );
        return super.getValidation();
    }
}

export class NowDateToEnv extends DeprecatedNow {
    public static readonly TAG = "now-date-to-env";

    protected getAssigned(): string {
        return this.getAssignedByType("java.sql.Date");
    }

    public getType(): string {
        return "Date";
    }
}

export class NowTimestamp extends DeprecatedNow {
    public static readonly TAG = "now-timestamp";

    protected getAssigned(): string {
        return this.getAssignedByType("java.sql.Timestamp");
    }

    public getType(): string {
        return "Timestamp";
    }
}
