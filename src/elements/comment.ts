import { Tag } from "./tag";
import { ValidChildren } from "../types";

export class Comment extends Tag {
    public getValidChildren(): ValidChildren {
        return {};
    }

    public getTagName(): string {
        return "!comment";
    }

    public convert(): string[] {
        return (this.tag.type === "comment" && this.stringComment(this.tag.comment)) || [];
    }

    private stringComment(comment: string): string[] {
        return comment.indexOf("\n") > -1 ? this.multiLine(comment) : this.singleLine(comment);
    }

    private singleLine(comment: string): string[] {
        return [`// ${comment.trim()}`];
    }

    private multiLine(comment: string): string[] {
        return [
            `/**`,
            ...comment.split("\n").map((str) => {
                return ` * ${str.trim()}`;
            }),
            `*/`,
        ];
    }
}
