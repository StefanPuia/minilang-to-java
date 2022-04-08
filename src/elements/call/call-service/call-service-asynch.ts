import { ValidationMap } from "../../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    StringBoolean,
    XMLSchemaElementAttributes,
} from "../../../types";
import { AbstractCallService } from "./abstract-call-service";

export class CallServiceAsynch extends AbstractCallService {
    public static readonly TAG = "call-service-asynch";
    protected attributes = this.attributes as CallServiceAsynchRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: [
                "serviceName",
                "in-map-name",
                "include-user-login",
            ],
            constantAttributes: ["include-user-login"],
            expressionAttributes: ["service-name", "in-map-name"],
            requiredAttributes: ["service-name"],
            noChildElements: true,
        };
    }

    private getAttributes(): CallServiceAsynchAttributes {
        return {
            serviceName: this.attributes["service-name"],
            inMapName: this.attributes["in-map-name"],
            includeUserLogin: this.attributes["include-user-login"] !== "false",
        };
    }

    public getType(): string | undefined {
        return;
    }

    public getField(): string | undefined {
        return;
    }

    public convert(): string[] {
        this.addException("GenericServiceException");
        this.setVariableToContext({ name: "dispatcher" });
        const { inMapName, includeUserLogin, serviceName } =
            this.getAttributes();
        const [contextMap, contextMapName] = this.createContextMap(
            serviceName,
            inMapName
        );
        return [
            ...contextMap,
            ...this.addUserLoginToMap(contextMapName, includeUserLogin),
            `dispatcher.runAsync(${this.getParameters(contextMapName).join(
                ", "
            )})`,
        ];
    }

    private getParameters(contextMap?: string): string[] {
        const { serviceName, inMapName } = this.getAttributes();
        const parameters: string[] = [`"${serviceName}"`];
        if (contextMap || inMapName) {
            parameters.push(contextMap ?? (inMapName as string));
        } else {
            this.converter.addImport("HashMap");
            parameters.push("new HashMap<>()");
        }
        return parameters;
    }
}

interface CallServiceAsynchRawAttributes extends XMLSchemaElementAttributes {
    "service-name": string;
    "in-map-name"?: string;
    "include-user-login"?: StringBoolean;
}

interface CallServiceAsynchAttributes {
    serviceName: FlexibleStringExpander;
    inMapName?: FlexibleMapAccessor;
    includeUserLogin: boolean;
}
