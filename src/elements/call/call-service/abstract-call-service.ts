import { Set } from "../../assignment/set";
import { CallerElement } from "../caller";

export abstract class AbstractCallService extends CallerElement {
    protected addUserLoginToMap(
        serviceName: string,
        includeUserLogin: boolean,
        inMapName?: string
    ): [result: string[], mapName?: string] {
        if (includeUserLogin) {
            const result: string[] = [];
            const inMap = inMapName || `${serviceName}Context`;
            this.setVariableToContext({ name: "userLogin" });
            result.push(
                ...Set.getInstance({
                    converter: this.converter,
                    parent: this.parent,
                    field: `${inMap}.userLogin`,
                    from: `userLogin`,
                    type: "GenericValue",
                }).convert()
            );
            return [result, inMap];
        }
        return [[]];
    }
}
