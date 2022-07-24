export const checkboxKeyMap = {
    logging_deprecated: "editor.logging.deprecated",
    logging_info: "editor.logging.info",
    logging_timing: "editor.logging.timing",
    logging_warning: "editor.logging.warning",
    logging_validation_error: "editor.logging.validation.error",
    logging_validation_warning: "editor.logging.validation.warning",
    logging_validation_deprecated: "editor.logging.validation.deprecated",
    converter_authServices: "editor.converter.authServices",
    converter_replicateMinilang: "editor.converter.replicateMinilang",
}
export const inputKeyMap = {
    converter_tabSize: "editor.converter.tabSize",
}
export const $ = (...args) => document.querySelector(...args);
export const store = (key, val) => localStorage.setItem(key, val);
export const get = (key) => localStorage.getItem(key) ?? "";
export const getBoolean = (key) => localStorage.getItem(key) === "true";
export const getInt = (key) => parseInt(localStorage.getItem(key)) || 0;