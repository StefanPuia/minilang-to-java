import * as convert from "xml-js";
import { XMLSchema } from "../types";

export default class ConvertUtils {
    public static parseXML(source: string): XMLSchema {
        return convert.xml2js(source, {
            compact: false,
        }) as XMLSchema;
    }

    // public static parseComponentURL(url: string) {
    //     return url.replace(
    //         /^component:\/\/([\w-]+)/i,
    //         (match: string, comp: string) => {
    //             const component = Ofbiz.getComponent(comp);
    //             if (!component)
    //                 throw new Error(`Component '${comp}' not loaded`);
    //             return component.getPath();
    //         }
    //     );
    // }

    public static normalizeMS(millis: number) {
        const SEC = 1000;
        const MIN = SEC * 60;
        const HOUR = MIN * 60;
        const hours = Math.floor(millis / HOUR);
        millis %= HOUR;
        const mins = Math.floor(millis / MIN);
        millis %= MIN;
        const sec = Math.floor(millis / SEC);
        millis %= SEC;

        return [
            hours ? `${hours} hours` : undefined,
            mins ? `${mins} mins` : undefined,
            sec ? `${sec} sec` : undefined,
            millis ? `${millis} ms` : undefined,
        ]
            .filter(Boolean)
            .join(", ");
    }

    public static importMap: Record<string, string> = {
        "com.stannah.base.entity.condition.EntityConditionBuilder": "EntityConditionBuilder",
        "com.stannah.base.utils.MiscUtils": "MiscUtils",
        "com.stannah.external.hr.EmployeeUtils": "EmployeeUtils",
        "java.lang.Boolean": "Boolean",
        "java.lang.Integer": "Integer",
        "java.lang.Long": "Long",
        "java.lang.Math": "Math",
        "java.lang.Object": "Object",
        "java.lang.String": "String",
        "java.math.BigDecimal": "BigDecimal",
        "java.math.RoundingMode": "RoundingMode",
        "java.sql.Date": "Date",
        "java.sql.Time": "Time",
        "java.sql.Timestamp": "Timestamp",
        "java.time.LocalDate": "LocalDate",
        "java.time.LocalDateTime": "LocalDateTime",
        "java.time.LocalTime": "LocalTime",
        "java.util.ArrayList": "ArrayList",
        "java.util.Date": "java.util.Date",
        "java.util.HashMap": "HashMap",
        "java.util.List": "List",
        "java.util.Locale": "Locale",
        "java.util.Map": "Map",
        "java.util.TimeZone": "TimeZone",
        "javax.servlet.http.HttpServletRequest": "HttpServletRequest",
        "javax.servlet.http.HttpServletResponse": "HttpServletResponse",
        "org.ofbiz.base.util.Debug": "Debug",
        "org.ofbiz.base.util.ScriptUtil": "ScriptUtil",
        "org.ofbiz.base.util.UtilDateTime": "UtilDateTime",
        "org.ofbiz.base.util.UtilMisc": "UtilMisc",
        "org.ofbiz.base.util.UtilValidate": "UtilValidate",
        "org.ofbiz.entity.Delegator": "Delegator",
        "org.ofbiz.entity.GenericEntityException": "GenericEntityException",
        "org.ofbiz.entity.GenericValue": "GenericValue",
        "org.ofbiz.entity.util.EntityQuery": "EntityQuery",
        "org.ofbiz.entity.util.EntityUtilProperties": "EntityUtilProperties",
        "org.ofbiz.service.DispatchContext": "DispatchContext",
        "org.ofbiz.service.GenericServiceException": "GenericServiceException",
        "org.ofbiz.service.LocalDispatcher": "LocalDispatcher",
        "org.ofbiz.service.ServiceUtil": "ServiceUtil",
    };

    public static qualify(unqualified: string) {
        return Object.entries(this.importMap).find(
            (entry) => entry[1] === unqualified
        )?.[0];
    }

    public static unqualify(qualified: string) {
        const className = this.importMap[qualified];
        return className ?? qualified;
    }

    public static requiresCast(field?: string, type?: string): boolean {
        if (typeof field === "undefined") {
            return false;
        }
        const { mapName } = this.mapMatch(field);
        if (type === "Object") {
            return false;
        }
        return ["parameters", "context"].includes(mapName);
    }

    public static parseFieldGetter(field: string | undefined) {
        if (typeof field === "undefined") {
            return field;
        }
        const { mapName, fieldName } = this.mapMatch(field);
        if (mapName && fieldName) {
            return `${mapName}.get("${fieldName}")`;
        }
        return field;
    }

    public static hasSetter(field: string | undefined) {
        if (typeof field === "undefined") {
            return false;
        }
        const { mapName, fieldName } = this.mapMatch(field);
        return mapName && fieldName;
    }

    public static parseFieldSetter(field: string | undefined, value: any) {
        if (typeof field === "undefined") {
            return field;
        }
        const { mapName, fieldName } = this.mapMatch(field);
        if (mapName && fieldName) {
            switch (mapName) {
                case "request":
                    return `request.setAttribute("${fieldName}", ${value})`;
                default:
                    return `${mapName}.put("${fieldName}", ${value})`;
            }
        }
        return `${field} = ${value}`;
    }

    public static mapMatch(field: string) {
        const { mapName, fieldName } =
            field.match(/^(?<mapName>\w.+?)\.(?<fieldName>\w.+)$/)?.groups ??
            {};

        return { mapName, fieldName };
    }

    public static isPrimitive(val?: string) {
        if (!val) return false;
        const value = ConvertUtils.stripQuotes(val);
        if (["true", "false"].includes(value)) {
            return true;
        }
        if (!isNaN(parseFloat(value))) {
            return true;
        }
        return false;
    }

    public static stripQuotes(value: string) {
        return (value ?? "").replace(/^"(.+)"$/, "$1");
    }
}
