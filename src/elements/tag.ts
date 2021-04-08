import { ValidChildren, VariableContext, XMLSchemaAnyElement } from "../types";
import { ContextUtils } from "../core/context-utils";
import { Converter } from "../core/converter";
import { ElementFactory } from "../core/element-factory";

export abstract class Tag {
    protected readonly converter: Converter;
    protected readonly tag: XMLSchemaAnyElement;
    protected readonly parent?: Tag;
    protected children?: Tag[] = undefined;
    private variableContext: VariableContext = {};

    constructor(tag: XMLSchemaAnyElement, converter: Converter, parent?: Tag) {
        this.tag = tag;
        this.parent = parent;
        this.converter = converter;

        this.prependIndentationMapper = this.prependIndentationMapper.bind(
            this
        );
    }

    public abstract convert(): string[];
    public abstract getValidChildren(): ValidChildren;
    public abstract getTagName(): string;

    protected hasOwnContext(): boolean {
        return false;
    }

    public getVariableContext(): VariableContext | undefined {
        return this.hasOwnContext()
            ? {
                  ...this.parent?.getVariableContext(),
                  ...this.variableContext,
              }
            : this.parent?.getVariableContext();
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
            count: 1,
            ...variable,
        };
        if (this.hasOwnContext()) {
            if (this?.parent?.getVariableFromContext(contextVariable.name)) {
                ContextUtils.setVariableToContext(
                    contextVariable,
                    this.parent?.getVariableContext()
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

    protected parseChildren(): Tag[] {
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
            this.validateChildren();
        }
        return children;
    }

    private validateChildren() {
        const validChildren = this.getValidChildren();
        const children = this.parseChildren()
            .filter((el) => !el.getTagName().startsWith("!"))
            .reduce((collector, element) => {
                collector[element.getTagName()] =
                    (collector[element.getTagName()] ?? 0) + 1;
                return collector;
            }, {} as Record<string, number>);

        for (const childTag of Object.keys(children)) {
            const count = children[childTag];
            const allowed = validChildren[childTag];
            if (allowed) {
                if (count < allowed.min) {
                    this.converter.appendMessage(
                        "ERROR",
                        `"${childTag}" cannot appear inside "${this.getTagName()}" fewer than ${
                            allowed.min
                        } times. Found ${count}.`,
                        "",
                        0
                    );
                }
                if (count > allowed.max) {
                    this.converter.appendMessage(
                        "ERROR",
                        `"${childTag}" cannot appear inside "${this.getTagName()}" more than ${
                            allowed.max
                        } times. Found ${count}.`,
                        "",
                        0
                    );
                }
            }
        }

        for (const childTag of Object.keys(validChildren)) {
            if (!children[childTag] && validChildren[childTag].min > 0) {
                this.converter.appendMessage(
                    "ERROR",
                    `Required child "${childTag}" not found inside "${this.getTagName()}"`,
                    "",
                    0
                );
            }
        }
    }

    public getParent(): Tag | undefined {
        return this.parent;
    }

    protected addException(exceptionClass: string) {
        this.parent?.addException(exceptionClass);
    }

    protected prependIndentationMapper(
        line: string,
        _index: number,
        _array: string[]
    ) {
        return `${this.converter.getIndentSpaces()}${line}`;
    }
}
