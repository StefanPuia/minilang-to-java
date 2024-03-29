import { NEWLINE } from "../consts";
import { Tag } from "./tag";

export class Comment extends Tag {
    public getTagName(): string {
        return "!comment";
    }

    public convert(): string[] {
        return (
            (this.tag.type === "comment" &&
                this.stringComment(this.tag.comment)) ||
            []
        );
    }

    private stringComment(comment: string): string[] {
        return comment.indexOf(NEWLINE) > -1
            ? this.multiLine(comment)
            : this.singleLine(comment);
    }

    private singleLine(comment: string): string[] {
        return [`// ${comment.trim()}`];
    }

    private multiLine(comment: string): string[] {
        const lines = comment.split(NEWLINE).filter((it) => it.trim());
        const { indentation } = (lines[0] ?? "").match(/^(?<indentation>\s*)/)
            ?.groups ?? { indentation: "" };
        const regex = new RegExp(`^${indentation}`);
        return [
            `/**`,
            ...lines.map((str) => {
                return ` * ${str.replace(regex, "")}`;
            }),
            `*/`,
        ];
    }
}
