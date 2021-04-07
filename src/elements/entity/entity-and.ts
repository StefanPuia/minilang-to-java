import { Set } from "../assignment/set";

export class EntityAnd extends Set {
    public getType() {
        return "List<GenericValue>";
    }

    public getField(): string {
        return this.attributes.list as string;
    }
}
