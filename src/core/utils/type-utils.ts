import { DEFAULT_MAP_TYPE, DEFAULT_TYPE } from "../../consts";
import { ContextVariable } from "../../types";
import { ContextUtils } from "./context-utils";
import ConvertUtils from "./convert-utils";

export const cast = (
    fromVariable?: ContextVariable,
    toType: string = DEFAULT_TYPE
): string => {
    // TODO: basic type verification
    if (!fromVariable) return "";
    const fromType = ContextUtils.getFullType(fromVariable);
    return fromType !== toType ? `(${toType}) ` : "";
};

export const guessFieldType = (field?: string, val?: any): string => {
    if (!field) {
        return DEFAULT_TYPE;
    }

    const value = ConvertUtils.stripQuotes(val);
    if (field.startsWith("is") || field.startsWith("has")) {
        if (value) {
            if (["true", "false"].includes(value) || value.includes("(")) {
                return "boolean";
            }
            return "String";
        }
        return "boolean";
    }
    if (ConvertUtils.mapMatch(field).mapName) {
        return DEFAULT_MAP_TYPE;
    }
    return DEFAULT_TYPE;
};
