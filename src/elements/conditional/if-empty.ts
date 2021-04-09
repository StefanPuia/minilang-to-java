import ConvertUtils from "../../core/convert-utils";
import { XMLSchemaElementAttributes } from "../../types";
import { ConditionalElement } from "./conditional";

export class IfEmpty extends ConditionalElement {
    protected attributes = this.attributes as IfEmptyAttributes;

    public convert(): string[] {
        this.converter.addImport("UtilValidate");

        if (this.parseChildren().length) {
            return [
                `if (${this.convertCondition()}) {`,
                ...this.convertChildren().map(this.prependIndentationMapper),
                ...this.getElseBlock(),
            ];
        } else {
            return [this.convertCondition()];
        }
    }

    private convertCondition(): string {
        return `${this.getNegated()}UtilValidate.isEmpty(${ConvertUtils.parseFieldGetter(
            this.attributes.field
        )})`;
    }
}

interface IfEmptyAttributes extends XMLSchemaElementAttributes {
    field: string;
}
