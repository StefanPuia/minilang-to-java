import { SetterElement } from "../assignment/setter";
import { FieldMap } from "./field-map";

export abstract class EntityElement extends SetterElement {
    protected getFromFieldMap() {
        this.converter.addImport("UtilMisc");
        return [
            `UtilMisc.toMap(`,
            ...this.parseChildren()
                .filter((el) => el instanceof FieldMap)
                .map((el) => (el as FieldMap).convertOnlyValues())
                .join(",\n")
                .split("\n")
                .map(this.prependIndentationMapper),
            `)`,
        ];
    }
}
