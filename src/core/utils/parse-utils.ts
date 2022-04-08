export const parseIntOrElse = (value?: string, orElse?: number) => {
    const parsed = parseInt(value ?? "");
    return !isNaN(parsed) ? parsed : orElse;
};
