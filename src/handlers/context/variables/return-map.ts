import { DEFAULT_MAP_TYPE } from "../../../consts";
import { ContextVariable } from "./context-variable";

export class ReturnMap extends ContextVariable {
    public getName(): string {
        return "_returnMap";
    }
    public getType(): string {
        return DEFAULT_MAP_TYPE;
    }
    public getParameterDeclaration(final?: boolean): undefined {
        return;
    }
}
