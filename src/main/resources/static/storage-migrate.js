import {checkboxKeyMap, get, inputKeyMap, store} from "./consts.js";

export function migrateStorage() {

    changeLog("001", () => {
        store(checkboxKeyMap.logging_deprecated, true);
        store(checkboxKeyMap.logging_info, true);
        store(checkboxKeyMap.logging_warning, true);
        store(inputKeyMap.converter_tabSize, 2);
    });
    changeLog("002", () => {
        store("editor.methodMode", "SERVICE");
        store(checkboxKeyMap.logging_validation_error, true);
        store(checkboxKeyMap.logging_validation_warning, true);
        store(checkboxKeyMap.logging_validation_deprecated, true);
    });
    changeLog("003", () => {
        store(checkboxKeyMap.logging_timing, true);
    });
}

const changeLog = (version, changeSet) => {
    if (currentVersion < version) {
        changeSet();
        storeVersion(version);
    }
}
const currentVersion = get("storage.version") || "000";
const storeVersion = (v) => store("storage.version", v);

