import { BaseSetterAttributes, SetterElement } from "./setter";

export class NowTimestamp extends SetterElement {
    protected attributes = this.attributes as BaseSetterAttributes;

    public getField(): string {
        return this.attributes.field;
    }

    private getAssigned(): string {
        this.converter.addImport("LocalDateTime");
        this.converter.addImport("Timestamp");
        return `Timestamp.valueOf(LocalDateTime.now())`;
    }

    public getType(): string {
        return "Timestamp";
    }

    public convert(): string[] {
        return [...this.wrapConvert(this.getAssigned())];
    }
}
