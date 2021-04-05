import { AddError } from "../elements/assignment/add-error";
import { ClearField } from "../elements/assignment/clear-field";
import { FailMessage } from "../elements/assignment/fail-message";
import { FailProperty } from "../elements/assignment/fail-property";
import { Field } from "../elements/assignment/field";
import { FieldToList } from "../elements/assignment/field-to-list";
import { FieldToResult } from "../elements/assignment/field-to-result";
import { NowDateToEnv } from "../elements/assignment/now-date-to-env";
import { NowTimestamp } from "../elements/assignment/now-timestamp";
import { Set } from "../elements/assignment/set";
import { StringTag } from "../elements/assignment/string";
import { CallClassMethod } from "../elements/call/call-class-method";
import { CallService } from "../elements/call/call-service";
import { PropertyInfo } from "../elements/call/property-info";
import { ResultToField } from "../elements/call/result-to-field";
import { ResultToMap } from "../elements/call/result-to-map";
import { ResultToRequest } from "../elements/call/result-to-request";
import { ResultToResult } from "../elements/call/result-to-result";
import { ResultToSession } from "../elements/call/result-to-session";
import { Comment } from "../elements/comment";
import { IfCompare } from "../elements/conditional/if-compare";
import { IfEmpty } from "../elements/conditional/if-empty";
import { IfNotEmpty } from "../elements/conditional/if-not-empty";
import { EntityOne } from "../elements/entity/entity-one";
import { FieldMap } from "../elements/entity/field-map";
import { Iterate } from "../elements/loops/iterate";
import { Root } from "../elements/root/root";
import { SimpleMethod } from "../elements/root/simple-method";
import { SimpleMethods } from "../elements/root/simple-methods";
import { XMLSchema, XMLSchemaAnyElement } from "../types";
import { Converter } from "./converter";
import { Tag } from "./tag";
import { UnparsedElement } from "./unparsed";

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
            case "add-error":
                return new AddError(self, converter, parent);
            case "fail-message":
                return new FailMessage(self, converter, parent);
            case "fail-property":
                return new FailProperty(self, converter, parent);
            case "clear-field":
                return new ClearField(self, converter, parent);
            case "field":
                return new Field(self, converter, parent);
            case "string":
                return new StringTag(self, converter, parent);
            case "field-to-result":
                return new FieldToResult(self, converter, parent);
            case "field-to-list":
                return new FieldToList(self, converter, parent);

            // conditions
            case "if-empty":
                return new IfEmpty(self, converter, parent);
            case "if-not-empty":
                return new IfNotEmpty(self, converter, parent);
            case "else":
                return new UnparsedElement(self, converter, parent);
            case "if-compare":
                return new IfCompare(self, converter, parent);

            // loops
            case "iterate":
                return new Iterate(self, converter, parent);

            // caller
            case "call-class-method":
                return new CallClassMethod(self, converter, parent);
            case "call-service":
                return new CallService(self, converter, parent);
            case "error-prefix":
            case "error-suffix":
            case "success-prefix":
            case "success-suffix":
            case "message-prefix":
            case "message-suffix":
            case "default-message":
                return new PropertyInfo(self, converter, parent);
            case "results-to-map":
                return new ResultToMap(self, converter, parent);
            case "result-to-field":
                return new ResultToField(self, converter, parent);
            case "result-to-request":
                return new ResultToRequest(self, converter, parent);
            case "result-to-session":
                return new ResultToSession(self, converter, parent);
            case "result-to-result":
                return new ResultToResult(self, converter, parent);

            // entity
            case "entity-one":
                return new EntityOne(self, converter, parent);
            case "field-map":
                return new FieldMap(self, converter, parent);

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
}
