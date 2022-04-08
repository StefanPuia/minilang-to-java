import * as convert from "xml-js";
import { XMLSchema } from "../../types";

export function parseXML(source: string): XMLSchema {
    return convert.xml2js(source, {
        compact: false,
    }) as XMLSchema;
}
