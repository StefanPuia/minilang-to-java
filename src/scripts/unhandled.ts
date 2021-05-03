import { readFile } from "fs";
import { join } from "path";
import ConvertUtils from "../core/convert-utils";
import { ElementFactory } from "../core/element-factory";
import { XMLSchemaElement } from "../types";

readFile(
    join(__dirname, "../../simple-methods.xsd"),
    "utf-8",
    async (err, data) => {
        if (err) {
            console.error(err);
        } else {
            await ElementFactory.loadClasses();
            const parsed = ConvertUtils.parseXML(data);
            const xsElements = (parsed
                .elements[1] as XMLSchemaElement)?.elements?.filter(
                (elem) => elem.type === "element" && elem.name === "xs:element"
            ) as XMLSchemaElement[];

            const unhandled = xsElements.filter((xsElem) => {
                const tagName = xsElem.attributes.name as string;
                return (
                    xsElem.attributes.abstract !== "true" &&
                    !ElementFactory.hasHandler(tagName)
                );
            });

            console.log(`${unhandled.length} unhandled tags:`);
            console.log(
                unhandled
                    .map((el) => el.attributes.name)
                    .sort()
                    .join(", ")
            );
        }
    }
);
