import { ValidationMap } from "../../core/validate";
import {
    FlexibleStringExpander,
    XMLSchemaElementAttributes,
} from "../../types";
import { ElementTag } from "../element-tag";

abstract class MessageElement extends ElementTag {
    protected abstract getErrorMessage(): string;

    public convert(): string[] {
        return this.converter
            .getErrorHandler()
            .returnError(this.getErrorMessage());
    }
}

export class FailMessage extends MessageElement {
    public static readonly TAG = "fail-message";
    protected attributes = this.attributes as FailMessageRawAttributes;

    protected getAttributes(): FailMessageAttributes {
        return {
            message: this.attributes.message,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["message"],
            requiredAttributes: ["message"],
            constantPlusExpressionAttributes: ["message"],
        };
    }

    protected getErrorMessage(): string {
        return `"${this.attributes.message}"`;
    }
}

interface FailMessageRawAttributes extends XMLSchemaElementAttributes {
    message: string;
}

interface FailMessageAttributes {
    message: FlexibleStringExpander;
}

export class FailProperty extends MessageElement {
    public static readonly TAG = "fail-property";
    protected attributes = this.attributes as FailPropertyRawAttributes;

    protected getAttributes(): FailPropertyAttributes {
        return {
            ...this.attributes,
        };
    }

    public getValidation(): ValidationMap {
        return {
            attributeNames: ["property", "resource"],
            requiredAttributes: ["property", "resource"],
            constantPlusExpressionAttributes: ["property", "resource"],
        };
    }

    protected getErrorMessage(): string {
        this.converter.addImport("MiscUtils");
        return `MiscUtils.getSingleLabel("${this.attributes.resource}", "${this.attributes.property}")`;
    }
}

interface FailPropertyRawAttributes extends XMLSchemaElementAttributes {
    resource: string;
    property: string;
}

interface FailPropertyAttributes {
    resource: string;
    property: string;
}
