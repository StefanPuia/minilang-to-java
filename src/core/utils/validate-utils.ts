export const isUndefined = (val: unknown) => {
    return typeof val === "undefined";
};

export const isNotUndefined = (val: unknown) => {
    return !isUndefined(val);
};
