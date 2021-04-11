import { BaseSetterAttributes, SetterElement } from "./setter";

export class NowDateToEnv extends SetterElement {
    public static readonly TAG = "now-date-to-env";
    protected attributes = this.attributes as BaseSetterAttributes;

    public getField(): string {
        return this.attributes.field;
    }

    private getAssigned(): string {
        this.converter.addImport("LocalDate");
        this.converter.addImport("java.sql.Date");
        return `Date.valueOf(LocalDate.now())`;
    }

    public getType(): string {
        return "Date";
    }

    public convert(): string[] {
        return [...this.wrapConvert(this.getAssigned())];
    }
}
