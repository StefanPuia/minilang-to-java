import { ConditionBehaviour } from "../../behavior/condition";
import { noEmptyChildren, ValidationMap } from "../../core/validate";
import {
    FlexibleMapAccessor,
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { SetElement } from "../assignment/set";
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

    private isConditionBehavior(tag: any): tag is ConditionBehaviour {
        return "convertConditionOnly" in tag;
    }

    public convert(): string[] {
        return [
            ...SetElement.getErrorMessageListDeclaration(
                this.getAttributes().errorList,
                this.converter,
                this.parent
            ),
            ...this.parseChildren()
                .filter(this.isConditionBehavior)
                .map((tag) => this.createAssertion(tag as any))
                .flat(),
        ];
    }

    private createAssertion(tag: ConditionBehaviour): string[] {
        const title = this.getAttributes().title ?? "";
        const errorMessage = `Assertion [${title.replace(/"/g, `\\"`)}] failed.`;
        return [
            `if (${tag.convertConditionOnly()}) {`,
            ...[
                `${this.getAttributes().errorList}.add("${errorMessage}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
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
