import { StringBoolean, XMLSchemaElementAttributes } from "../../types";
import { CallService } from "./call-service";

export class CallServiceAsynch extends CallService {
    public getType(): string | undefined {
        return;
    }

    public getField(): string | undefined {
        return;
    }

    public convert(): string[] {
        this.addException("GenericServiceException");
        this.setVariableToContext({ name: "dispatcher" });
        return [
            ...this.addUserLoginToMap(),
            `dispatcher.runAsync(${this.getParameters().join(", ")})`,
        ];
    }
}

interface CallServiceAsynchAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "in-map-name"?: string;
    "include-user-login"?: StringBoolean;
}
