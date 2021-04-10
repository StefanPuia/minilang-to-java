import { ValidChildren, XMLSchemaCdataElement } from "../types";
import { Comment } from "./comment";
import { Tag } from "./tag";

export abstract class CdataTag extends Tag {
    protected tag = this.tag as XMLSchemaCdataElement;

    public getValidChildren(): ValidChildren {
        return {};
    }

    public getTagName(): string {
        return "!cdata";
    }

    public convert(): string[] {
        return new Comment(
            {
                type: "comment",
                comment: this.tag.cdata,
            },
            this.converter,
            this.parent
        ).convert();
    }
}
