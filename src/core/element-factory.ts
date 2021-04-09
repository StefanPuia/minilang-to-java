import { AddError } from "../elements/assignment/add-error";
import { ClearField } from "../elements/assignment/clear-field";
import { FailMessage } from "../elements/assignment/fail-message";
import { FailProperty } from "../elements/assignment/fail-property";
import { Field } from "../elements/assignment/field";
import { FieldToList } from "../elements/assignment/field-to-list";
import { FieldToResult } from "../elements/assignment/field-to-result";
import { FirstFromList } from "../elements/assignment/first-from-list";
import { NowDateToEnv } from "../elements/assignment/now-date-to-env";
import { NowTimestamp } from "../elements/assignment/now-timestamp";
import { PropertyToField } from "../elements/assignment/property-to-field";
import { Set } from "../elements/assignment/set";
import { StringTag } from "../elements/assignment/string";
import { CallClassMethod } from "../elements/call/call-class-method";
import { CallService } from "../elements/call/call-service";
import { CallServiceAsynch } from "../elements/call/call-service-asynch";
import { PropertyInfo } from "../elements/call/property-info";
import { ResultToField } from "../elements/call/result-to-field";
import { ResultToMap } from "../elements/call/result-to-map";
import { ResultToRequest } from "../elements/call/result-to-request";
import { ResultToResult } from "../elements/call/result-to-result";
import { ResultToSession } from "../elements/call/result-to-session";
import { ScriptTag, ScriptTextTag } from "../elements/call/script";
import { Comment } from "../elements/comment";
import { And } from "../elements/conditional/and";
import { Condition } from "../elements/conditional/condition";
import { Else } from "../elements/conditional/else";
import { ElseIf } from "../elements/conditional/else-if";
import { If } from "../elements/conditional/if";
import { IfCompare } from "../elements/conditional/if-compare";
import { IfCompareField } from "../elements/conditional/if-compare-field";
import { IfEmpty } from "../elements/conditional/if-empty";
import { IfNotEmpty } from "../elements/conditional/if-not-empty";
import { ConditionExpr } from "../elements/entity/condition-expr";
import { ConditionList } from "../elements/entity/condition-list";
import { CreateValue } from "../elements/entity/create-value";
import { EntityAnd } from "../elements/entity/entity-and";
import { EntityCondition } from "../elements/entity/entity-condition";
import { EntityOne } from "../elements/entity/entity-one";
import { FieldMap } from "../elements/entity/field-map";
import { MakeValue } from "../elements/entity/make-value";
import { StoreValue } from "../elements/entity/store-value";
import { Iterate } from "../elements/loops/iterate";
import { Root } from "../elements/root/root";
import { SimpleMethod } from "../elements/root/simple-method";
import { SimpleMethods } from "../elements/root/simple-methods";
import { Tag } from "../elements/tag";
import { UndefinedElement } from "../elements/undefined";
import { UnparsedElement } from "../elements/unparsed";
import { XMLSchema, XMLSchemaAnyElement } from "../types";
import { Converter } from "./converter";

export class ElementFactory {
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
            case "first-from-list":
                return new FirstFromList(self, converter, parent);
            case "property-to-field":
                return new PropertyToField(self, converter, parent);

            // conditions
            case "if-empty":
                return new IfEmpty(self, converter, parent);
            case "if-not-empty":
                return new IfNotEmpty(self, converter, parent);
            case "else":
                return new Else(self, converter, parent);
            case "if-compare":
                return new IfCompare(self, converter, parent);
            case "and":
                return new And(self, converter, parent);
            case "condition":
                return new Condition(self, converter, parent);
            case "then":
                return new UnparsedElement(self, converter, parent);
            case "if":
                return new If(self, converter, parent);
            case "else-if":
                return new ElseIf(self, converter, parent);
            case "if-compare-field":
                return new IfCompareField(self, converter, parent);

            // loops
            case "iterate":
                return new Iterate(self, converter, parent);

            // caller
            case "call-class-method":
                return new CallClassMethod(self, converter, parent);
            case "call-service":
                return new CallService(self, converter, parent);
            case "call-service-asynch":
                return new CallServiceAsynch(self, converter, parent);
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
            case "script":
                return new ScriptTag(self, converter, parent);

            // entity
            case "entity-one":
                return new EntityOne(self, converter, parent);
            case "field-map":
                return new FieldMap(self, converter, parent);
            case "make-value":
                return new MakeValue(self, converter, parent);
            case "entity-and":
                return new EntityAnd(self, converter, parent);
            case "condition-list":
                return new ConditionList(self, converter, parent);
            case "entity-condition":
                return new EntityCondition(self, converter, parent);
            case "condition-expr":
                return new ConditionExpr(self, converter, parent);
            case "create-value":
                return new CreateValue(self, converter, parent);
            case "store-value":
                return new StoreValue(self, converter, parent);

            // not used
            case "check-errors":
                return new UnparsedElement(self, converter, parent);

            //
            default:
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
}
