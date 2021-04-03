import ConvertUtils from "../../core/convert-utils";
import { SetterElement } from "./setter";

export class NowTimestamp extends SetterElement {
    private getAssigned(): string {
        this.converter.addImport("LocalDateTime");
        this.converter.addImport("Timestamp");
        return `Timestamp.valueOf(LocalDateTime.now())`;
    }
    protected getType(): string {
        return "Timestamp";
    }

    public convert(): string[] {
        return [this.wrapConvert(this.getAssigned())];
    }
}
