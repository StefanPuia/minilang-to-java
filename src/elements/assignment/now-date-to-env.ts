import ConvertUtils from "../../core/convert-utils";
import { SetterElement } from "./setter";

export class NowDateToEnv extends SetterElement {
    private getAssigned(): string {
        this.converter.addImport("LocalDate");
        this.converter.addImport("java.sql.Date");
        return `Date.valueOf(LocalDate.now())`;
    }
    protected getType(): string {
        return "Date";
    }

    public convert(): string[] {
        return [this.wrapConvert(this.getAssigned())];
    }
}
