import { SetElement } from "../../assignment/set";
import { CallerElement } from "../caller";

export abstract class AbstractCallService extends CallerElement {
    protected addUserLoginToMap(
        serviceName: string,
        includeUserLogin: boolean,
        inMapName?: string
    ): [result: string[], mapName?: string] {
        if (
            this.converter.config.authenticateServicesAutomatically ||
            includeUserLogin
        ) {
            const inMap = inMapName || `${serviceName}Context`;
            this.setVariableToContext({ name: "userLogin" });
            return [
                [
                    ...SetElement.getInstance({
                        converter: this.converter,
                        parent: this.parent,
                        field: `${inMap}.userLogin`,
                        from: `userLogin`,
                        type: "GenericValue",
                    }).convert(),
                ],
                inMap,
            ];
        }
        return [[]];
    }
}
