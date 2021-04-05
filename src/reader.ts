import { Converter } from "./core/converter";
import { readFile } from "fs";
import { join } from "path";
import { MethodMode } from "./types";

readFile(join(__dirname, "../read.xml"), "utf-8", (err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.clear();
        console.log(Converter.convert(data, MethodMode.SERVICE));
    }
});
