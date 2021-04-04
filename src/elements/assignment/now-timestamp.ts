import { BaseSetterAttributes, SetterElement } from "./setter";

export class NowTimestamp extends SetterElement {
    protected attributes = this.attributes as BaseSetterAttributes;

    protected getField(): string {
        return this.attributes.field;
    }

    private getAssigned(): string {
        this.converter.addImport("LocalDateTime");
        this.converter.addImport("Timestamp");
        return `Timestamp.valueOf(LocalDateTime.now())`;
    }

    protected getType(): string {
        return "Timestamp";
    }

    public convert(): string[] {
        return [...this.wrapConvert(this.getAssigned())];
    }
}
