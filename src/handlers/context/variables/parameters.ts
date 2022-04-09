import { DEFAULT_MAP_TYPE } from "../../../consts";
import { ContextVariable } from "./context-variable";

export class Parameters extends ContextVariable {
    public getName(): string {
        return "parameters";
    }
    public getType(): string {
        return DEFAULT_MAP_TYPE;
    }
}