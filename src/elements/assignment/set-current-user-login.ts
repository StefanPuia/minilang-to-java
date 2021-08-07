import { ElementTag } from "../element-tag";

export class SetCurrentUserLogin extends ElementTag {
    public static readonly TAG = "set-current-user-login";

    public convert(): string[] {
        const error =
            `"${this.tag.name}" is deprecated. You can pass ` +
            "an alternate UserLogin entity value to the " +
            "called service's IN attributes.";
        this.converter.appendMessage("ERROR", error, this.position);
        return [error];
    }
}
