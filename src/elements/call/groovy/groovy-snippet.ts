import { CallerElement } from "../caller";
import { ScriptTextTag } from "./script";

export abstract class GroovySnippet extends CallerElement {
    public getType(): string | undefined {
        return;
    }
    public getField(): string | undefined {
        return;
    }

    protected getInline(): string[] {
        const script = this.getScript();
        const location = this.getLocation();
        if (location) {
            this.setVariableToContext({ name: "context" });
            this.converter.addImport("ScriptUtil");
            return [`ScriptUtil.executeScript("${location}", null, context);`];
        } else if (script) {
            return new ScriptTextTag(
                {
                    type: "text",
                    text: script,
                },
                this.converter,
                this.parent
            ).convert();
        }
        return [];
    }

    public convert(): string[] {
        return this.getLocation() || this.getScript()
            ? this.getInline()
            : this.convertChildren();
    }

    protected getScript(): string | undefined {
        return;
    }
    protected getLocation(): string | undefined {
        return;
    }
}
