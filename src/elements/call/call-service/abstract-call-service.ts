import { DEFAULT_MAP_TYPE } from "../../../consts";
import ConvertUtils from "../../../core/utils/convert-utils";
import { SetElement } from "../../assignment/set";
import { CallerElement } from "../caller";

export abstract class AbstractCallService extends CallerElement {
    protected addUserLoginToMap(
        inMapName: string,
        includeUserLogin: boolean
    ): string[] {
        if (
            this.converter.config.authenticateServicesAutomatically ||
            includeUserLogin
        ) {
            this.setVariableToContext({ name: "userLogin" });
            return SetElement.getInstance({
                converter: this.converter,
                parent: this.parent,
                field: `${inMapName}.userLogin`,
                from: `userLogin`,
                type: "GenericValue",
            }).convert();
        }
        return [];
    }

    protected createContextMap(
        serviceName: string,
        inMapName?: string
    ): [output: string[], contextMapName: string] {
        const inMap = inMapName || `${serviceName}Context`;
        if (!this.getVariableFromContext(inMap)) {
            return [
                SetElement.getInstance({
                    converter: this.converter,
                    parent: this.parent,
                    field: inMap,
                    value: `NewMap`,
                    type: DEFAULT_MAP_TYPE,
                }).convert(),
                inMap,
            ];
        }
        return [[], inMap];
    }
}
