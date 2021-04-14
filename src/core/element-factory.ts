import { readdir, stat } from "fs";
import { join, resolve } from "path";
import { ScriptCdataTag, ScriptTextTag } from "../elements/call/groovy/script";
import { Comment } from "../elements/comment";
import { Root } from "../elements/root/root";
import { Tag } from "../elements/tag";
import { UndefinedElement } from "../elements/undefined";
import { XMLSchema, XMLSchemaAnyElement } from "../types";
import { Converter } from "./converter";

export class ElementFactory {
    private static TAG_MAP: Record<string, any>;

    public static parse(
        self: XMLSchemaAnyElement,
        converter: Converter,
        parent?: Tag
    ): Tag {
        if (self.type === "comment") {
            return new Comment(self, converter, parent);
        }
        if (self.type === "text") {
            switch (parent?.getTagName()) {
                case "script":
                    return new ScriptTextTag(self, converter, parent);
            }
            return this.makeErrorComment(
                `Error parsing text element contained in "${
                    parent?.getTagName() ?? "unknown parent"
                }"`,
                converter,
                parent
            );
        }
        if (self.type === "cdata") {
            switch (parent?.getTagName()) {
                case "call-bsh":
                    return new ScriptCdataTag(self, converter, parent);
            }
            return this.makeErrorComment(
                `Error parsing text element contained in "${
                    parent?.getTagName() ?? "unknown parent"
                }"`,
                converter,
                parent
            );
        }

        if (ElementFactory.TAG_MAP[self.name]) {
            return new ElementFactory.TAG_MAP[self.name](
                self,
                converter,
                parent
            );
        } else {
            return new UndefinedElement(self, converter, parent);
        }
    }

    private static makeErrorComment(
        message: string,
        converter: Converter,
        parent?: Tag
    ): Comment {
        return new Comment(
            {
                type: "comment",
                comment: message,
            },
            converter,
            parent
        );
    }

    public static parseWithRoot(parsed: XMLSchema, converter: Converter) {
        return new Root(
            {
                type: "element",
                elements: parsed.elements,
                name: "!root",
                attributes: {},
            },
            converter
        ).convert();
    }

    public static loadClasses(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof ElementFactory.TAG_MAP !== "undefined") {
                return resolve();
            }
            console.log("Loading element classes...");
            ElementFactory.TAG_MAP = {};
            ElementFactory.walk(
                join(__dirname, "../elements"),
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    for (const file of results ?? []) {
                        if (file.match(/.+\.[tj]s/)) {
                            const classFile = require(file);
                            for (const clazz of Object.keys(classFile)) {
                                if (classFile[clazz]?.TAG) {
                                    ElementFactory.TAG_MAP[
                                        classFile[clazz].TAG
                                    ] = classFile[clazz];
                                }
                            }
                        }
                    }
                    resolve();
                }
            );
        });
    }

    private static walk(dir: string, done: (err: any, res?: string[]) => void) {
        let results: string[] = [];
        readdir(dir, function (err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function (file) {
                file = resolve(dir, file);
                stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        ElementFactory.walk(file, function (err, res) {
                            results = [...results, ...(res ?? [])];
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }
}
