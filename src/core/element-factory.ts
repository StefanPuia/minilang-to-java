import { SimpleMethods } from "../elements/root/simple-methods";
import { Tag } from "./tag";
import { XMLSchemaAnyElement } from "../types";
import { Converter } from "./converter";
import { Comment } from "../elements/comment";
import { SimpleMethod } from "../elements/root/simple-method";
import { Set } from "../elements/assignment/set";
import { NowTimestamp } from "../elements/assignment/now-timestamp";
import { NowDateToEnv } from "../elements/assignment/now-date-to-env";
import { IfEmpty } from "../elements/conditional/if-empty";
import { UnparsedElement } from "./unparsed";
import { IfNotEmpty } from "../elements/conditional/if-not-empty";
import { CallClassMethod } from "../elements/call/call-class-method";

export class ElementFactory {
    public static parse(self: XMLSchemaAnyElement, converter: Converter, parent?: Tag): Tag {
        if (self.type === "comment") {
            return new Comment(self, converter, parent);
        }
        switch (self.name) {
            // root
            case "simple-methods":
                return new SimpleMethods(self, converter, parent);
            case "simple-method":
                return new SimpleMethod(self, converter, parent);

            // assignment
            case "set":
                return new Set(self, converter, parent);
            case "now-timestamp":
                return new NowTimestamp(self, converter, parent);
            case "now-date-to-env":
                return new NowDateToEnv(self, converter, parent);

            // conditions
            case "if-empty":
                return new IfEmpty(self, converter, parent);
            case "if-not-empty":
                return new IfNotEmpty(self, converter, parent);
            case "else":
                return new UnparsedElement(self, converter, parent);

            // caller
            case "call-class-method":
                return new CallClassMethod(self, converter, parent);

            //
            default:
                return this.makeErrorComment(
                    `Parser not defined for element "${self.name}"`,
                    converter,
                    parent
                );
        }
    }

    private static makeErrorComment(message: string, converter: Converter, parent?: Tag): Comment {
        return new Comment(
            {
                type: "comment",
                comment: message,
            },
            converter,
            parent
        );
    }
}
