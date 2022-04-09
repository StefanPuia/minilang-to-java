import { ContextVariable } from "./context-variable";

export class UserLogin extends ContextVariable {
    public getName(): string {
        return "userLogin";
    }
    public getType(): string {
        return "GenericValue";
    }
}
