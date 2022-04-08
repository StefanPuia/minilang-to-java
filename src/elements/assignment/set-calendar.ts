import ConvertUtils from "../../core/utils/convert-utils";
import { ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    StringBoolean,
} from "../../types";
import { BaseSetterRawAttributes, SetterElement } from "./setter";

export class SetCalendar extends SetterElement {
    public static readonly TAG = "set-calendar";
    protected attributes = this.attributes as SetCalendarRawAttributes;

    public getValidation(): ValidationMap {
        return {
            deprecatedAttributes: [
                { name: "from-field", fixInstruction: 'replace with "from"' },
                {
                    name: "default-value",
                    fixInstruction: 'replace with "default"',
                },
            ],
            attributeNames: [
                "field",
                "from-field",
                "from",
                "value",
                "default-value",
                "default",
                "set-if-null",
                "years",
                "months",
                "days",
                "hours",
                "minutes",
                "seconds",
                "millis",
                "period-align-start",
                "period-align-end",
                "locale",
                "time-zone",
            ],
            requiredAttributes: ["field"],
            requireAnyAttribute: ["from", "value"],
            constantPlusExpressionAttributes: ["value"],
            constantAttributes: ["set-if-null"],
            expressionAttributes: ["field", "from", "from-field"],
            noChildElements: true,
        };
    }

    private getAttributes(): SetCalendarAttributes {
        const {
            field,
            from,
            "from-field": fromField,
            value,
            "default": defaultVal,
            "default-value": defaultValue,
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
            millis,
            locale,
            "time-zone": timeZone,
            "set-if-null": setIfNull,
            "period-align-start": periodAlignStart,
            "period-align-end": periodAlignEnd,
        } = this.attributes;

        return {
            field,
            from: (fromField ?? from) as FlexibleMapAccessor,
            value: value as FlexibleStringExpander,
            default: defaultValue ?? defaultVal,
            setIfNull: setIfNull === "true",
            years: years as FlexibleStringExpander,
            months: months as FlexibleStringExpander,
            days: days as FlexibleStringExpander,
            hours: hours as FlexibleStringExpander,
            minutes: minutes as FlexibleStringExpander,
            seconds: seconds as FlexibleStringExpander,
            millis: millis as FlexibleStringExpander,
            periodAlignStart: periodAlignStart as FlexibleStringExpander,
            periodAlignEnd: periodAlignEnd as FlexibleStringExpander,
            locale: locale as FlexibleStringExpander,
            timeZone: timeZone as FlexibleStringExpander,
        };
    }

    public getType(): string {
        return "Timestamp";
    }
    public getField(): string {
        return this.getAttributes().field;
    }
    public convert(): string[] {
        return this.wrapCondition(
            this.wrapConvert(
                [
                    "Timestamp.valueOf(",
                    `${ConvertUtils.parseFieldGetter(
                        this.getAttributes().from
                    )}.toLocalDateTime()`,
                    ...[
                        "years",
                        "months",
                        "days",
                        "hours",
                        "minutes",
                        "seconds",
                    ]
                        .map((method) => this.getPlusMethod(method as AddType))
                        .flat(),
                    ")",
                ].join("")
            )
        );
    }

    private getPlusMethod(method: AddType): string[] {
        const value = this.getAttributes()[method];
        if (value) {
            return [
                `.plus${method.charAt(0).toUpperCase()}${method.substr(
                    1
                )}(${this.converter.parseValue(value)})`,
            ];
        }
        return [];
    }

    private getValue(): string {
        return this.getAttributes().from ?? this.getAttributes().value;
    }

    private wrapCondition(nested: string[]): string[] {
        if (this.getAttributes().setIfNull) {
            return [
                `if (${this.getField()} == null) {`,
                ...nested.map(this.prependIndentationMapper),
                "}",
            ];
        }
        return nested;
    }
}

type PeriodAlign = "year" | "month" | "week" | "day";
interface SetCalendarRawAttributes extends BaseSetterRawAttributes {
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

interface SetCalendarAttributes {
    field: FlexibleMapAccessor;
    from: FlexibleMapAccessor;
    value: FlexibleStringExpander;
    default?: FlexibleStringExpander;
    setIfNull: boolean;
    years: FlexibleStringExpander;
    months: FlexibleStringExpander;
    days: FlexibleStringExpander;
    hours: FlexibleStringExpander;
    minutes: FlexibleStringExpander;
    seconds: FlexibleStringExpander;
    millis: FlexibleStringExpander;
    periodAlignStart: FlexibleStringExpander;
    periodAlignEnd: FlexibleStringExpander;
    locale: FlexibleStringExpander;
    timeZone: FlexibleStringExpander;
}

type AddType = "years" | "months" | "days" | "hours" | "minutes" | "seconds";
