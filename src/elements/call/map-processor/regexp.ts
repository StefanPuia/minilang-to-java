import { ProcessBehaviour } from "../../../behavior/process";
import ConvertUtils from "../../../core/utils/convert-utils";
import { XMLSchemaElementAttributes } from "../../../types";
import { ElementTag } from "../../element-tag";

export class Regexp extends ElementTag implements ProcessBehaviour {
    public static readonly TAG = "regexp";
    protected attributes = this.attributes as RegexpAttributes;

    public convert(): string[] {
        this.converter.appendMessage(
            "ERROR",
            "Method not implemented.",
            this.position
        );
        return [];
    }

    public convertProcessOperation(
        mapName: string,
        fieldName: string,
        errorListName: string
    ): string[] {
        this.converter.addImport("Pattern");
        this.converter.addImport("Perl5Matcher");
        this.converter.addImport("PatternMatcher");
        this.converter.addImport("PatternFactory");
        const fieldValue = `${mapName}.get("${fieldName}").toString()`;
        const patternName = ConvertUtils.validVariableName(
            `${fieldName}Pattern`
        );
        return [
            `final Pattern ${patternName} = `,
            `PatternFactory.createOrGetPerl5CompiledPattern("${this.attributes.expr}", true);`,
            `if (!new Perl5Matcher().matches(${fieldValue}, ${patternName})) {`,
            ...[
                `${errorListName}.add("Expression validation failed for ${mapName}.${fieldName}");`,
            ].map(this.prependIndentationMapper),
            `}`,
        ];
    }
}

interface RegexpAttributes extends XMLSchemaElementAttributes {
    expr: string;
}
