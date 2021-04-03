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
        "com.stannah.base.utils.MiscUtils": "MiscUtils",
        "java.lang.Long": "Long",
        "java.sql.Date": "Date",
        "java.sql.Time": "Time",
        "java.sql.Timestamp": "Timestamp",
        "java.time.LocalDate": "LocalDate",
        "java.time.LocalDateTime": "LocalDateTime",
        "java.time.LocalTime": "LocalTime",
        "java.util.Date": "java.util.Date",
        "org.ofbiz.base.util.UtilDateTime": "UtilDateTime",
        "org.ofbiz.base.util.UtilValidate": "UtilValidate",
    }

    public static qualify(unqualified: string) {
        return Object.entries(this.importMap).find(entry => entry[1] === unqualified)?.[0];
    }

    public static unqualify(qualified: string) {
        const className = this.importMap[qualified];
        return className ?? qualified;
    }

    public static parseValue(val: string) {
        const valueMap = {
            "null": "null",
            "NewList": "new ArrayList<>()",
            "NewMap": "new HashMap<>()"
        } as Record<string, string>;
        return valueMap[val] ?? `"${val}"` ?? "null";
    }

    public static parseFieldGetter(field: string | undefined) {
        if (typeof field === "undefined") {
            return field;
        }
        const { mapName, fieldName } = field.match(/^(?<mapName>\w.+?)\.(?<fieldName>\w.+)$/)?.groups ?? {};
        if (mapName && fieldName) {
            return `${mapName}.get("${fieldName}")`;
        }
        return field;
    }
    public static parseFieldSetter(field: string | undefined, value: any) {
        if (typeof field === "undefined") {
            return field;
        }
        const { mapName, fieldName } = field.match(/^(?<mapName>\w.+?)\.(?<fieldName>\w.+)$/)?.groups ?? {};
        if (mapName && fieldName) {
            return `${mapName}.set("${fieldName}", ${value})`;
        }
        return `${field} = ${value}`;
    }
}
