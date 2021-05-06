import { PropertyInfo } from "./property-info";

export class MessageSuffix extends PropertyInfo {
    public getMessage(): string {
        throw new Error("Method not implemented.");
    }
    public static readonly TAG = "message-suffix";
}