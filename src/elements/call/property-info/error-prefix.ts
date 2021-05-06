import { PropertyInfo } from "./property-info";

export class ErrorPrefix extends PropertyInfo {
    public getMessage(): string {
        throw new Error("Method not implemented.");
    }
    public static readonly TAG = "error-prefix";
}