import { PropertyInfo } from "./property-info";

export class SuccessSuffix extends PropertyInfo {
    public getMessage(): string {
        throw new Error("Method not implemented.");
    }
    public static readonly TAG = "success-prefix";
}