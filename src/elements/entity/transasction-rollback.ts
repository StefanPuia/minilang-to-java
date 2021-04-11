import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class TransactionRollback extends ElementTag {
    public static readonly TAG = "transaction-rollback";
    protected attributes = this.attributes as TransactionRollbackAttributes;

    public convert(): string[] {
        this.converter.addImport("TransactionUtil");
        this.addException("GenericTransactionException");
        return [
            `TransactionUtil.rollback(${this.getBeganTransactionName()}, "", null);`,
        ];
    }

    public getBeganTransactionName() {
        return this.attributes["began-transaction-name"];
    }
}

interface TransactionRollbackAttributes extends XMLSchemaElementAttributes {
    "began-transaction-name"?: string;
}
