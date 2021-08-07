import { ConditionBehavior } from "../../behavior/condition";
import { noEmptyChildren, ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { Set } from "../assignment/set";
import { ElementTag } from "../element-tag";

export class Assert extends ElementTag {
    public static readonly TAG = "assert";
    protected attributes = this.attributes as AssertRawAttributes;

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["title", "error-list-name"],
            constantAttributes: ["title", "error-list-name"],
            childElementPredicate: noEmptyChildren,
        };
    }

    private getAttributes(): AssertAttributes {
        const { title, "error-list-name": errorList } = this.attributes;
        return {
            title,
            errorList: errorList ?? "error_list",
        };
    }

    private isConditionBehavior(tag: any): tag is ConditionBehavior {
        return "convertConditionOnly" in tag;
    }

    public convert(): string[] {
        return [
            ...this.getErrorMessageListDeclaration(),
            ...this.parseChildren()
                .filter(this.isConditionBehavior)
                .map((tag) => this.createAssertion(tag as any))
                .flat(),
        ];
    }

    private createAssertion(tag: ConditionBehavior): string[] {
        const title = this.getAttributes().title ?? "";
        const errorMessage = `Assertion [${title.replace(/"/, `\\"`)}] failed.`;
        return [
            `if (${tag.convertConditionOnly()}) {`,
            ...[
                `${this.getAttributes().errorList}.add("${errorMessage}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
    }

    private getErrorMessageListDeclaration() {
        return Set.getInstance({
            converter: this.converter,
            parent: this.parent,
            field: this.getAttributes().errorList,
            value: "NewList",
            type: "List<String>",
        }).convert();
    }
}

interface AssertRawAttributes extends XMLSchemaElementAttributes {
    "title"?: string;
    "error-list-name"?: string;
}

interface AssertAttributes {
    title?: FlexibleStringExpander;
    errorList: FlexibleMapAccessor;
}
