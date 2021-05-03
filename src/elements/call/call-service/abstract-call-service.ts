import { Set } from "../../assignment/set";
import { CallerElement } from "../caller";

export abstract class AbstractCallService extends CallerElement {
    protected addUserLoginToMap(): string[] {
        if (
            this.attributes["in-map-name"] &&
            (this.attributes["include-user-login"] ?? "true") === "true"
        ) {
            this.setVariableToContext({ name: "userLogin" });
            return Set.getInstance({
                converter: this.converter,
                parent: this.parent,
                field: `${this.attributes["in-map-name"]}.userLogin`,
                from: `userLogin`,
                type: "GenericValue",
            }).convert();
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
