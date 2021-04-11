import { XMLSchemaElementAttributes } from "../../types";
import { ElementTag } from "../element-tag";

export class TransactionCommit extends ElementTag {
    public static readonly TAG = "transaction-commit";
    protected attributes = this.attributes as TransactionCommitAttributes;

    public convert(): string[] {
        this.converter.addImport("TransactionUtil");
        this.addException("GenericTransactionException");
        return [`TransactionUtil.commit(${this.getBeganTransactionName()});`];
    }

    public getBeganTransactionName() {
        return this.attributes["began-transaction-name"];
    }
}

interface TransactionCommitAttributes extends XMLSchemaElementAttributes {
    "began-transaction-name"?: string;
}
