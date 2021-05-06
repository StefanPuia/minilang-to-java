import { PropertyInfo } from "./property-info";

export class DefaultMessage extends PropertyInfo {
    public getMessage(): string {
        throw new Error("Method not implemented.");
    }
    public static readonly TAG = "default-message";
}