import { XMLSchemaTextElement } from "../types";
import { Comment } from "./comment";
import { Tag } from "./tag";

export abstract class TextTag extends Tag {
    protected tag = this.tag as XMLSchemaTextElement;

    public getTagName(): string {
        return "!text";
    }

    public convert(): string[] {
        return new Comment(
            {
                type: "comment",
                comment: this.tag.text,
            },
            this.converter,
            this.parent
        ).convert();
    }
}
