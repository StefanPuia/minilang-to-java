import { SetterElement } from "../assignment/setter";

export abstract class ResultTo extends SetterElement {
    public abstract getResultAttribute(): string | undefined;
}

