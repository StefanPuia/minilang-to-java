import { StringBoolean } from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class SetCalendar extends SetterElement {
    public static readonly TAG = "set-calendar";
    protected attributes = this.attributes as SetCalendarAttributes;

    public getType(): string {
        return "Timestamp";
    }
    public getField(): string {
        return this.attributes.field;
    }
    public convert(): string[] {
        return this.wrapConvert("");
    }

    protected getUnsupportedAttributes() {
        return [
            "from",
            "from-field",
            "value",
            "default",
            "default-value",
            "years",
            "months",
            "days",
            "hours",
            "minutes",
            "seconds",
            "millis",
            "locale",
            "time-zone",
            "set-if-null",
            "period-align-start",
            "period-align-end",
        ];
    }
}

type PeriodAlign = "year" | "month" | "week" | "day";
interface SetCalendarAttributes extends BaseSetterRawAttributes {
    "from"?: string;
    "from-field"?: string;
    "value"?: string;
    "default"?: string;
    "default-value"?: string;
    "years"?: string;
    "months"?: string;
    "days"?: string;
    "hours"?: string;
    "minutes"?: string;
    "seconds"?: string;
    "millis"?: string;
    "locale"?: string;
    "time-zone"?: string;
    "set-if-null": StringBoolean;
    "period-align-start"?: PeriodAlign;
    "period-align-end"?: PeriodAlign;
}
