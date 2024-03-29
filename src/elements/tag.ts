import { ContextUtils } from "../core/utils/context-utils";
import { Converter } from "../core/converter";
import { ElementFactory } from "../core/element-factory";
import { Validation, ValidationMap } from "../core/validate";
import {
    Position,
    VariableContext,
    XMLSchemaAnyElement,
    XMLSchemaElementAttributes,
} from "../types";

export abstract class Tag {
    protected readonly converter: Converter;
    protected readonly tag: XMLSchemaAnyElement;
    protected readonly parent?: Tag;
    protected children?: Tag[] = undefined;
    protected variableContext: VariableContext = {};

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        this.tag = tag;
        this.parent = parent;
        this.converter = converter;

        this.prependIndentationMapper =
            this.prependIndentationMapper.bind(this);
        this.validate();
    }

    public abstract convert(): string[];
    public abstract getTagName(): string;

    protected hasOwnContext(): boolean {
        return false;
    }

    public getVariableContext(): VariableContext | undefined {
        return this.hasOwnContext()
            ? {
                  ...this.getParentVariableContext(),
                  ...this.variableContext,
              }
            : this.getParentVariableContext();
    }

    public getVariableFromContext(variable: string) {
        return this.getVariableContext()?.[variable];
    }

    public setVariableToContext(variable: {
        name: string;
        type?: string;
        typeParams?: string[];
        count?: number;
    }) {
        const contextVariable = {
            typeParams: [],
            ...variable,
        };
        if (this.hasOwnContext()) {
            if (this?.parent?.getVariableFromContext(contextVariable.name)) {
                ContextUtils.setVariableToContext(
                    contextVariable,
                    this.getParentVariableContext()
                );
            } else {
                ContextUtils.setVariableToContext(
                    contextVariable,
                    this.variableContext
                );
            }
        } else {
            this.parent?.setVariableToContext(contextVariable);
        }
    }

    protected parseChildren(): Array<Tag> {
        let children: Tag[] = this.children ?? [];
        if (this.children === undefined) {
            children = this.children =
                this.tag.type === "element"
                    ? this.tag.elements
                          ?.map((self) =>
                              ElementFactory.parse(self, this.converter, this)
                          )
                          .filter((tag) => tag !== null) ?? ([] as Tag[])
                    : [];
        }
        return children;
    }

    public getParent<T extends Tag>(tagName?: string): T | undefined {
        if (typeof tagName !== "undefined") {
            return this.getParents().find(
                (el) => el.getTagName() === tagName
            ) as T;
        }
        return this.parent as T;
    }

    protected getParentVariableContext() {
        return this.parent?.getVariableContext();
    }

    protected addException(exceptionClass: string) {
        this.parent?.addException(exceptionClass);
    }

    protected getParents(): Tag[] {
        if (this.parent) {
            return [this.parent, ...this.parent.getParents()];
        }
        return [];
    }

    protected prependIndentationMapper(
        line: string,
        _index: number,
        _array: string[]
    ) {
        return `${this.converter.getIndentSpaces()}${line}`;
    }

    public getValidation(): ValidationMap {
        return {};
    }

    private validate() {
        Validation.validate(this, this.converter);
    }

    public getTagAttributes(): XMLSchemaElementAttributes {
        return {};
    }

    public getPosition(): Position | undefined {
        return undefined;
    }

    public getTag(): XMLSchemaAnyElement {
        return this.tag;
    }

    protected findChild(...tagsToFind: string[]): Tag | undefined {
        if (tagsToFind.includes(this.getTagName())) {
            return this;
        }
        return this.parseChildren().find(child => child.findChild(...tagsToFind));
    }
}
