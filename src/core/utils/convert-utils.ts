export default class ConvertUtils {
    public static requiresCast(field?: string, type?: string): boolean {
        if (typeof field === "undefined") {
            return false;
        }
        const { mapName } = this.mapMatch(field);
        if (type === "Object") {
            return false;
        }
        return ["parameters", "context"].includes(mapName);
    }

    public static parseFieldGetter(field: string | undefined) {
        if (typeof field === "undefined") {
            return field;
        }
        const { mapName, fieldName } = this.mapMatch(field);
        if (mapName && fieldName) {
            return `${mapName}.get("${fieldName}")`;
        }
        return field;
    }

    public static hasSetter(field: string | undefined) {
        if (typeof field === "undefined") {
            return false;
        }
        const { mapName, fieldName } = this.mapMatch(field);
        return mapName && fieldName;
    }

    public static parseFieldSetter(field: string | undefined, value: any) {
        if (typeof field === "undefined") {
            return field;
        }
        const { mapName, fieldName } = this.mapMatch(field);
        if (mapName && fieldName) {
            switch (mapName) {
                case "request":
                    return `request.setAttribute("${fieldName}", ${value})`;
                default:
                    return `${mapName}.put("${fieldName}", ${value})`;
            }
        }
        return `${field} = ${value}`;
    }

    public static mapMatch(field: string) {
        const { mapName, fieldName } =
            field.match(/^(?<mapName>\w.+?)\.(?<fieldName>\w.+)$/)?.groups ??
            {};

        return { mapName, fieldName };
    }

    public static isPrimitive(val?: string) {
        if (!val) return false;
        const value = ConvertUtils.stripQuotes(val);
        if (["true", "false"].includes(value)) {
            return true;
        }
        if (!isNaN(parseFloat(value))) {
            return true;
        }
        return false;
    }

    public static stripQuotes(value: string) {
        return (value ?? "").replace(/^"(.+)"$/, "$1");
    }

    public static validVariableName(varName: string) {
        return varName
            .replace(/(?:^\w|[A-Z]|[^a-zA-Z]\w)/g, function (word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/[^a-zA-Z]/g, "");
    }
}
