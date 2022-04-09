import { DEFAULT_TYPE } from "../../consts";
import { ContextVariable } from "../../types";
import { ContextUtils } from "./context-utils";

export const cast = (
    fromVariable?: ContextVariable,
    toType: string = DEFAULT_TYPE
): string => {
    // TODO: basic type verification
    if (!fromVariable) return "";
    const fromType = ContextUtils.getFullType(fromVariable);
    return fromType !== toType ? `(${toType}) ` : "";
};
