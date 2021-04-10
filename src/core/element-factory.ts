import { AddError } from "../elements/assignment/add-error";
import { ClearField } from "../elements/assignment/clear-field";
import { FailMessage } from "../elements/assignment/fail-message";
import { FailProperty } from "../elements/assignment/fail-property";
import { Field } from "../elements/assignment/field";
import { FieldToList } from "../elements/assignment/field-to-list";
import { FieldToResult } from "../elements/assignment/field-to-result";
import { FilterListByDate } from "../elements/assignment/filter-list-by-date";
import { FirstFromList } from "../elements/assignment/first-from-list";
import { NowDateToEnv } from "../elements/assignment/now-date-to-env";
import { NowTimestamp } from "../elements/assignment/now-timestamp";
import { PropertyToField } from "../elements/assignment/property-to-field";
import { SessionToField } from "../elements/assignment/session-to-field";
import { Set } from "../elements/assignment/set";
import { SetCalendar } from "../elements/assignment/set-calendar";
import { StringTag } from "../elements/assignment/string";
import { Calcop } from "../elements/calculate/calcop";
import { Calculate } from "../elements/calculate/calculate";
import { NumberElement } from "../elements/calculate/number";
import { CallBsh } from "../elements/call/call-bsh";
import { CallClassMethod } from "../elements/call/call-class-method";
import { CallObjectMethod } from "../elements/call/call-object-method";
import { CallService } from "../elements/call/call-service";
import { CallServiceAsynch } from "../elements/call/call-service-asynch";
import { CallSimpleMethod } from "../elements/call/call-simple-method";
import { PropertyInfo } from "../elements/call/property-info";
import { ResultToField } from "../elements/call/result-to-field";
import { ResultToMap } from "../elements/call/result-to-map";
import { ResultToRequest } from "../elements/call/result-to-request";
import { ResultToResult } from "../elements/call/result-to-result";
import { ResultToSession } from "../elements/call/result-to-session";
import { ScriptCdataTag, ScriptTag, ScriptTextTag } from "../elements/call/script";
import { SetServiceFields } from "../elements/call/set-service-fields";
import { Comment } from "../elements/comment";
import { And } from "../elements/conditional/and";
import { Condition } from "../elements/conditional/condition";
import { Else } from "../elements/conditional/else";
import { ElseIf } from "../elements/conditional/else-if";
import { If } from "../elements/conditional/if";
import { IfCompare } from "../elements/conditional/if-compare";
import { IfCompareField } from "../elements/conditional/if-compare-field";
import { IfEmpty } from "../elements/conditional/if-empty";
import { IfInstanceOf } from "../elements/conditional/if-instance-of";
import { IfNotEmpty } from "../elements/conditional/if-not-empty";
import { IfValidateMethod } from "../elements/conditional/if-validate-method";
import { Not } from "../elements/conditional/not";
import { Or } from "../elements/conditional/or";
import { Return } from "../elements/conditional/return";
import { ConditionExpr } from "../elements/entity/condition-expr";
import { ConditionList } from "../elements/entity/condition-list";
import { CreateValue } from "../elements/entity/create-value";
import { EntityAnd } from "../elements/entity/entity-and";
import { EntityCondition } from "../elements/entity/entity-condition";
import { EntityOne } from "../elements/entity/entity-one";
import { FieldMap } from "../elements/entity/field-map";
import { MakeValue } from "../elements/entity/make-value";
import { OrderBy } from "../elements/entity/order-by";
import { RemoveList } from "../elements/entity/remove-list";
import { RemoveValue } from "../elements/entity/remove-value";
import { SelectField } from "../elements/entity/select-field";
import { SequencedId } from "../elements/entity/sequenced-id";
import { SetNonPKFields } from "../elements/entity/set-nonpk-fields";
import { SetPKFields } from "../elements/entity/set-pk-fields";
import { StoreValue } from "../elements/entity/store-value";
import { TransactionBegin } from "../elements/entity/transaction-begin";
import { TransactionCommit } from "../elements/entity/transasction-commit";
import { TransactionRollback } from "../elements/entity/transasction-rollback";
import { Log } from "../elements/logging/log";
import { Trace } from "../elements/logging/trace";
import { Break } from "../elements/loops/break";
import { Iterate } from "../elements/loops/iterate";
import { Loop } from "../elements/loops/loop";
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
            case "set-calendar":
                return new SetCalendar(self, converter, parent);
            case "session-to-field":
                return new SessionToField(self, converter, parent);
            case "filter-list-by-date":
                return new FilterListByDate(self, converter, parent);

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
            case "or":
                return new Or(self, converter, parent);
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
            case "not":
                return new Not(self, converter, parent);
            case "if-validate-method":
                return new IfValidateMethod(self, converter, parent);
            case "if-instance-of":
                return new IfInstanceOf(self, converter, parent);
            case "return":
                return new Return(self, converter, parent);

            // loops
            case "iterate":
                return new Iterate(self, converter, parent);
            case "loop":
                return new Loop(self, converter, parent);
            case "break":
                return new Break(self, converter, parent);

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
            case "set-service-fields":
                return new SetServiceFields(self, converter, parent);
            case "call-simple-method":
                return new CallSimpleMethod(self, converter, parent);
            case "call-object-method":
                return new CallObjectMethod(self, converter, parent);
            case "call-bsh":
                return new CallBsh(self, converter, parent);

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
            case "remove-value":
                return new RemoveValue(self, converter, parent);
            case "remove-list":
                return new RemoveList(self, converter, parent);
            case "sequenced-id":
                return new SequencedId(self, converter, parent);
            case "select-field":
                return new SelectField(self, converter, parent);
            case "order-by":
                return new OrderBy(self, converter, parent);
            case "transaction-begin":
                return new TransactionBegin(self, converter, parent);
            case "transaction-commit":
                return new TransactionCommit(self, converter, parent);
            case "transaction-rollback":
                return new TransactionRollback(self, converter, parent);
            case "set-pk-fields":
                return new SetPKFields(self, converter, parent);
            case "set-nonpk-fields":
                return new SetNonPKFields(self, converter, parent);

            // logging
            case "log":
                return new Log(self, converter, parent);
            case "trace":
                return new Trace(self, converter, parent);

            // calculate
            case "calcop":
                return new Calcop(self, converter, parent);
            case "calculate":
                return new Calculate(self, converter, parent);
            case "number":
                return new NumberElement(self, converter, parent);

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
