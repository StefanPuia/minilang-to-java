import { Tag } from "../elements/tag";
import { MessageType, XMLSchemaElement } from "../types";
import { Converter } from "./converter";

export abstract class Validation {
    public static validate(tag: Tag, converter: Converter) {
        const {
            attributeNames,
            attributeValues,
            constantAttributes,
            expressionAttributes,
            constantPlusExpressionAttributes,
            unhandledAttributes,
            deprecatedAttributes,
            requireAnyAttribute,
            requiredAttributes,
            scriptAttributes,
            noChildElements,
            childElements,
            childElementPredicate,
            unhandledChildElements,
            requireAnyChildElement,
            requiredChildElements,
        } = tag.getValidation();

        new AttributeNames(tag, converter).validate(attributeNames);
        new AttributeValues(tag, converter).validate(attributeValues);
        // new ConstantAttributes(tag, converter).validate(constantAttributes);
        new UnhandledAttributes(tag, converter).validate(unhandledAttributes);
        // new ExpressionAttributes(tag, converter).validate(expressionAttributes);
        // new ConstantPlusExpressionAttributes(tag, converter).validate(
        //     constantPlusExpressionAttributes
        // );
        new DeprecatedAttributes(tag, converter).validate(deprecatedAttributes);
        new RequireAnyAttribute(tag, converter).validate(requireAnyAttribute);
        new RequiredAttributes(tag, converter).validate(requiredAttributes);
        new ScriptAttributes(tag, converter).validate(scriptAttributes);
        new NoChildElements(tag, converter).validate(noChildElements);
        new ChildElements(tag, converter).validate(childElements);
        new UnhandledChildElements(tag, converter).validate(
            unhandledChildElements
        );
        new RequireAnyChildElement(tag, converter).validate(
            requireAnyChildElement
        );
        new RequiredChildElements(tag, converter).validate(
            requiredChildElements
        );
        new ChildMethodValidator(tag, converter).validate(
            childElementPredicate
        );
    }

    public static isConstantAttribute(attributeValue: string): boolean {
        return true;
    }
    public static isExpressionAttribute(attributeValue: string): boolean {
        return true;
    }
    public static isConstantPlusExpressionAttribute(
        attributeValue: string
    ): boolean {
        return true;
    }
    public static containsScript(attributeValue: string): boolean {
        return true;
    }
}

abstract class BaseValidator {
    protected tag: Tag;
    protected converter: Converter;
    protected abstract rule?: unknown;

    constructor(tag: Tag, converter: Converter) {
        this.tag = tag;
        this.converter = converter;
    }

    private setRule(rule: unknown): BaseValidator {
        this.rule = rule;
        return this;
    }

    public validate(rule: unknown) {
        if (typeof rule !== "undefined") {
            this.setRule(rule).execute();
        }
    }

    protected abstract execute(): void;

    protected addMessage(message: string, type: MessageType = "ERROR") {
        this.converter.appendMessage(type, message, this.tag.getPosition());
    }
}

class AttributeNames extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        Object.keys(this.tag.getTagAttributes())
            .filter((attr) => !this.rule.includes(attr))
            .forEach((invalidAttribute) => {
                this.addMessage(
                    `Attribute "${invalidAttribute}" is not valid for tag "${this.tag.getTagName()}"`
                );
            });
    }
}

class AttributeValues extends BaseValidator {
    protected rule!: AttributeValue[];

    protected execute(): void {
        this.rule
            .filter(({ name }) =>
                Reflect.has(this.tag.getTagAttributes(), name)
            )
            .filter(
                ({ name, values }) =>
                    !values.includes(
                        this.tag.getTagAttributes()[name] as string
                    )
            )
            .forEach(({ name, values }) => {
                this.addMessage(
                    `Attribute "${name}" does not have a valid value (${
                        this.tag.getTagAttributes()[name]
                    }) for tag "${this.tag.getTagName()}". Must be one of ['${values.join(
                        "', '"
                    )}']`
                );
            });
    }
}

class ConstantAttributes extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        Object.keys(this.tag.getTagAttributes())
            .filter((attr) => this.rule.includes(attr))
            .filter(
                (attr) =>
                    !Validation.isConstantAttribute(
                        this.tag.getTagAttributes()[attr] as string
                    )
            )
            .forEach((invalidAttribute) => {
                this.addMessage(
                    `Constant attribute "${invalidAttribute}" cannot contain an expression`
                );
            });
    }
}

class ExpressionAttributes extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        Object.keys(this.tag.getTagAttributes())
            .filter((attr) => this.rule.includes(attr))
            .filter(
                (attr) =>
                    !Validation.isConstantAttribute(
                        this.tag.getTagAttributes()[attr] as string
                    )
            )
            .forEach((invalidAttribute) => {
                this.addMessage(
                    `Expression attribute "${invalidAttribute}" cannot contain a script (remove script)`
                );
            });
    }
}

class ConstantPlusExpressionAttributes extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        Object.keys(this.tag.getTagAttributes())
            .filter((attr) => this.rule.includes(attr))
            .filter(
                (attr) =>
                    !Validation.isConstantPlusExpressionAttribute(
                        this.tag.getTagAttributes()[attr] as string
                    )
            )
            .forEach((invalidAttribute) => {
                this.addMessage(
                    `Constant+expr attribute "${invalidAttribute}" is missing a constant value (expression-only constants are not allowed)`
                );
            });

        Object.keys(this.tag.getTagAttributes())
            .filter((attr) => this.rule.includes(attr))
            .filter((attr) =>
                Validation.containsScript(
                    this.tag.getTagAttributes()[attr] as string
                )
            )
            .forEach((invalidAttribute) => {
                this.addMessage(
                    `Constant+expr attribute "${invalidAttribute}" cannot contain a script (remove script)`
                );
            });
    }
}

class DeprecatedAttributes extends BaseValidator {
    protected rule!: (DeprecatedAttributeRule | string)[];

    protected execute(): void {
        Object.keys(this.tag.getTagAttributes())
            .map((attr) =>
                this.rule.find(
                    (deprecated) => this.getAttribute(deprecated) === attr
                )
            )
            .filter(Boolean)
            .forEach((deprecated) => {
                this.addMessage(
                    `Attribute "${this.getAttribute(
                        deprecated!
                    )}" is deprecated ${this.getFixInstruction(deprecated!)}`,
                    "DEPRECATE"
                );
            });
    }

    private getAttribute(attr: DeprecatedAttributeRule | string): string {
        return typeof attr === "string" ? attr : attr.name;
    }

    private getFixInstruction(attr: DeprecatedAttributeRule | string): string {
        return typeof attr === "string" ? "" : `(${attr!.fixInstruction})`;
    }
}

class UnhandledAttributes extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        Object.keys(this.tag.getTagAttributes())
            .map((attr) => this.rule.find((unhandled) => unhandled === attr))
            .filter(Boolean)
            .forEach((unhandled) => {
                this.addMessage(
                    `Attribute "${unhandled}" is unhandled for "${this.tag.getTagName()}"`,
                    "ERROR"
                );
            });
    }
}

class RequireAnyAttribute extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        if (
            !this.rule.find((required) =>
                Reflect.has(this.tag.getTagAttributes(), required)
            )
        ) {
            this.addMessage(
                `Element "${this.tag.getTagName()}" must include one of "${this.rule.join(
                    `", "`
                )}" attributes.`
            );
        }
    }
}

class RequiredAttributes extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        this.rule
            .filter(
                (required) =>
                    !Reflect.has(this.tag.getTagAttributes(), required)
            )
            .forEach((required) => {
                this.addMessage(`Required attribute "${required}" is missing.`);
            });
    }
}

class ScriptAttributes extends BaseValidator {
    protected rule!: string[];

    protected execute(): void {
        // TODO:
    }
}

abstract class ChildValidator extends BaseValidator {
    protected children: XMLSchemaElement[] = this.getChildren();

    private getChildren() {
        const tag = this.tag.getTag();
        return ((tag.type === "element" && tag.elements) || []).filter(
            (el) => el.type === "element"
        ) as XMLSchemaElement[];
    }
}

class NoChildElements extends ChildValidator {
    protected rule!: boolean;

    protected execute(): void {
        if (this.rule && this.children.length) {
            this.addMessage(
                `Element "${this.tag.getTagName()}" does not allow children.`
            );
        }
    }
}

class ChildMethodValidator extends ChildValidator {
    protected rule!: [(elements?: XMLSchemaElement[]) => boolean, string?];

    protected execute(): void {
        const [predicate, message] = this.rule;
        if (!predicate(this.children)) {
            this.addMessage(
                message ??
                    `Children of element "${this.tag.getTagName()}" failed validation criteria.`
            );
        }
    }
}

class ChildElements extends ChildValidator {
    protected rule!: string[];

    protected execute(): void {
        this.children
            .filter(
                (child) => !this.rule.find((allowed) => allowed === child.name)
            )
            .forEach((child) => {
                this.addMessage(
                    `Child element "${
                        child.name
                    }" is not valid for tag "${this.tag.getTagName()}".`
                );
            });
    }
}

class UnhandledChildElements extends ChildValidator {
    protected rule!: string[];

    protected execute(): void {
        this.children
            .filter((child) =>
                this.rule.find((unhandled) => unhandled === child.name)
            )
            .forEach((child) => {
                this.addMessage(
                    `Child element "${
                        child.name
                    }" is unhandled for tag "${this.tag.getTagName()}".`
                );
            });
    }
}

class RequireAnyChildElement extends ChildValidator {
    protected rule!: string[];

    protected execute(): void {
        if (
            !this.rule.find((required) =>
                this.children.find((el) => el.name === required)
            )
        ) {
            this.addMessage(
                `Element "${this.tag.getTagName()}" must include one of "${this.rule.join(
                    `", "`
                )}" child elements.`
            );
        }
    }
}

class RequiredChildElements extends ChildValidator {
    protected rule!: string[];

    protected execute(): void {
        this.rule
            .filter(
                (required) => !this.children.find((el) => el.name === required)
            )
            .forEach((required) => {
                this.addMessage(
                    `Required child element "${required}" is missing.`
                );
            });
    }
}

type ChildElementPredicateRule = [
    (elements?: XMLSchemaElement[]) => boolean,
    string?
];

export interface ValidationMap {
    /** fails if attribute found that is not in this list */
    attributeNames?: string[];

    /** specify list of valid values for attributes */
    attributeValues?: AttributeValue[];

    /** specified attributes have to be constants */
    constantAttributes?: string[];

    /** specified attributes have to be expressions */
    expressionAttributes?: string[];

    /** specified attributes are unhandled by the converter */
    unhandledAttributes?: string[];

    /** specified attributes have to be constant+expression */
    constantPlusExpressionAttributes?: string[];

    /** specified attributes are marked as deprecated (optional message) */
    deprecatedAttributes?: (DeprecatedAttributeRule | string)[];

    /** require at least one of the specified attributes */
    requireAnyAttribute?: string[];

    /** require all of the specified attributes */
    requiredAttributes?: string[];

    /** TODO */
    scriptAttributes?: string[];

    /** element cannot have child elements */
    noChildElements?: boolean;

    /** validate list of children (fails if any children not declared are found) */
    childElements?: string[];

    /** specified children are unhandled by the converter */
    unhandledChildElements?: string[];

    /** require at least one of the specified child element */
    requireAnyChildElement?: string[];

    /** require all of the specified child elements */
    requiredChildElements?: string[];

    /** test child elements against a predicate */
    childElementPredicate?: ChildElementPredicateRule;
}

export const noEmptyChildren: ChildElementPredicateRule = [
    (elements) => (elements?.length ?? 0) > 0,
    "At least one child element must be present.",
];

interface DeprecatedAttributeRule {
    name: string;
    fixInstruction: string;
}

interface AttributeValue {
    name: string;
    values: string[];
}
