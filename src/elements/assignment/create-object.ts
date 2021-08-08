import { ElementTag } from "../element-tag";

export class CreateObject extends ElementTag {
    public static readonly TAG = "create-object";

    public convert(): string[] {
        const error =
            `"${this.tag.name}" is deprecated. Use the script element`;
        this.converter.appendMessage("ERROR", error, this.position);
        return [error];
    }
}
