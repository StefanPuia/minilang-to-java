import { XMLSchemaElementAttributes } from "../../types";
import { SetterElement } from "../assignment/setter";
import { ElementTag } from "../element-tag";

export class TransactionBegin extends SetterElement {
    protected attributes = this.attributes as TransactionBeginAttributes;
    public getType(): string | undefined {
        return "boolean";
    }
    public getField(): string | undefined {
        return this.getBeganTransactionName();
    }

    public convert(): string[] {
        this.converter.addImport("TransactionUtil");
        this.addException("GenericTransactionException");
        return [
            "// FIXME: Transacting code is meant to be wrapped in a try/catch block.",
            ...this.wrapConvert("TransactionUtil.begin()"),
        ];
    }
    public getBeganTransactionName() {
        return this.attributes["began-transaction-name"];
    }
}

interface TransactionBeginAttributes extends XMLSchemaElementAttributes {
    "began-transaction-name"?: string;
}
