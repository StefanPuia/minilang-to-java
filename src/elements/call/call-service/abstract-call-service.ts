import { Set } from "../../assignment/set";
import { CallerElement } from "../caller";

export abstract class AbstractCallService extends CallerElement {
    protected addUserLoginToMap(): string[] {
        if (
            this.attributes["in-map-name"] &&
            (this.attributes["include-user-login"] ?? "true") === "true"
        ) {
            this.setVariableToContext({ name: "userLogin" });
            return new Set(
                {
                    type: "element",
                    name: "set",
                    attributes: {
                        "field": `${this.attributes["in-map-name"]}.userLogin`,
                        "from-field": "userLogin",
                    },
                },
                this.converter,
                this.parent
            ).convert();
        }
        return [];
    }

    protected getParameters(): string[] {
        return [
            `"${this.attributes["service-name"]}"`,
            this.attributes["in-map-name"],
        ].filter(Boolean) as string[];
    }
}
