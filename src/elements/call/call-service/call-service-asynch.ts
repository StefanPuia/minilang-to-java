import { StringBoolean, XMLSchemaElementAttributes } from "../../../types";
import { AbstractCallService } from "./abstract-call-service";

export class CallServiceAsynch extends AbstractCallService {
    public static readonly TAG = "call-service-asynch";
    protected attributes = this.attributes as CallServiceAsynchAttributes;

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
