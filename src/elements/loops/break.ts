import { ElementTag } from "../element-tag";
import { LoopingElement } from "./looping";

export class Break extends ElementTag {
    public static readonly TAG = "break";
    public convert() {
        const loopParent = this.getParents().find(
            (el) => el instanceof LoopingElement
        );
        if (loopParent) {
            return ["break;"];
        } else {
            this.addException("IllegalStateException");
            this.converter.appendMessage(
                "ERROR",
                `"break" tag used outside of loop element.`
            );
            return [
                `throw new IllegalStateException("Cannot use a break outside a loop context")`,
            ];
        }
    }
}
