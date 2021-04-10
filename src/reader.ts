import { Converter } from "./core/converter";
import { readFile, writeFileSync } from "fs";
import { join } from "path";
import { MethodMode } from "./types";

const start = new Date().getTime();
readFile(join(__dirname, "../read.xml"), "utf-8", (err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.clear();
        writeFileSync(
            join(__dirname, "../out.java"),
            Converter.convert(data, MethodMode.SERVICE)
        );
        const end = new Date().getTime();
        console.log(
            `Finished parsing ${data.split("\n").length} lines in ${(
                (end - start) /
                Math.pow(10, 3)
            ).toFixed(3)} seconds.`
        );
    }
});
