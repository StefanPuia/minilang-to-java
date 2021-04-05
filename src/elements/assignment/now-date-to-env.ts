import ConvertUtils from "../../core/convert-utils";
import { BaseSetterAttributes, SetterElement } from "./setter";

export class NowDateToEnv extends SetterElement {
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
        return [
            ...this.wrapConvert(this.getAssigned())
        ];
    }
}
