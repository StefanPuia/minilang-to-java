import {checkboxKeyMap, get, inputKeyMap, store} from "./consts.js";

export function migrateStorage() {
    const storeVersion = (v) => store("storage.version", v);
    const version = get("storage.version") || "000";

    if (version < "001") {
        store("editor.methodMode", "SERVICE");
        store(checkboxKeyMap.logging_deprecated, true);
        store(checkboxKeyMap.logging_info, true);
        store(checkboxKeyMap.logging_warning, true);
        store(inputKeyMap.converter_tabSize, 2);
        storeVersion("001");
    }

    if (version < "002") {
        store("editor.methodMode", "SERVICE");
        store(checkboxKeyMap.logging_validation_error, true);
        store(checkboxKeyMap.logging_validation_warning, true);
        storeVersion("002");
    }
}