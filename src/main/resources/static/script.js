import {migrateStorage} from "./storage-migrate.js";
import {
    $,
    checkboxKeyMap,
    get,
    getBoolean,
    inputKeyMap,
    store
} from "./consts.js";

const aceSession = (id) => ace.edit(id).getSession();

migrateStorage();
initAceEditors();
addSubmitConvertListener();
loadStoredData();
addEditorCollapseListener();
addOptionsListeners();

function initAceEditors() {
    const options = {
        selectionStyle: "text",
        wrap: true,
        theme: "ace/theme/monokai",
        fontSize: "15px",
    };

    ace.edit("input", {
        ...options, mode: "ace/mode/xml",
    });

    ace.edit("output", {
        ...options, mode: "ace/mode/java",
    });
}

function addSubmitConvertListener() {
    const $className = $("#className");
    $("#submit").addEventListener("click", async () => {
        try {
            $("#submit").disabled = "disabled";
            const $methodMode = $("#mode");
            const input = aceSession("input").getValue();

            localStorage.setItem("editor.inputText", input);
            localStorage.setItem("editor.className", $className.value);
            localStorage.setItem("editor.methodMode", $methodMode.value);

            const res = await fetch("/convert", {
                method: "post", headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    input,
                    className: $className.value,
                    methodMode: $methodMode.value,
                    options: {
                        ...Object.values(checkboxKeyMap).reduce(
                            (prev, curr) => ({
                                ...prev,
                                [curr]: getBoolean(curr)
                            }),
                            {}),
                        ...Object.values(inputKeyMap).reduce(
                            (prev, curr) => ({...prev, [curr]: get(curr)}),
                            {}),
                    }
                    // logging: {
                    //     deprecated: getBoolean(
                    //         checkboxKeyMap.logging_deprecated),
                    //     info: getBoolean(checkboxKeyMap.logging_info),
                    //     warning: getBoolean(checkboxKeyMap.logging_warning),
                    // },
                    // converterOptions: {
                    //     authServices: getBoolean(
                    //         checkboxKeyMap.converter_authServices),
                    //     replicateMinilang: getBoolean(
                    //         checkboxKeyMap.converter_replicateMinilang),
                    //     tabSize: getInt(inputKeyMap.converter_tabSize),
                    // },
                }),
            });

            const data = await res.json();
            if (res.ok) {
                aceSession("output").setValue(data?.output ?? data);
            } else {
                // noinspection ExceptionCaughtLocallyJS
                throw data;
            }
        } catch (err) {
            console.trace(err);
            aceSession("output").setValue(err?.message ?? JSON.stringify(err));
        } finally {
            $("#submit").disabled = undefined;
        }
    });
}

function loadStoredData() {
    aceSession("input").setValue(get("editor.inputText") ?? "");
    $("#className").value = get("editor.className") ?? "";
    $("#mode").value = get("editor.methodMode");
    Object.entries(checkboxKeyMap).forEach(([selector, storageKey]) => {
        $(`#${selector}`).checked = getBoolean(storageKey);
    });
    Object.entries(inputKeyMap).forEach(([selector, storageKey]) => {
        $(`#${selector}`).value = get(storageKey);
    });
}

function addEditorCollapseListener() {
    const $splitSizes = $("#controls #splitSizes");
    $splitSizes.addEventListener("input", (e) => {
        const $container = $("#container");
        const sizeMap = {
            [-1]: "10em 1fr", [0]: "1fr 1fr", [1]: "1fr 10em",
        };
        $container.style.gridTemplateColumns = sizeMap[$splitSizes.value];
        ["input", "output"].forEach((el) => {
            const session = aceSession(el);
            session.setWrapLimitRange(Math.max(session.getScreenLength(), 10),
                null);
        });
    });
}

function addOptionsListeners() {
    const $options = $("#options_wrapper");
    const toggleOptions = (e) => {
        if ($options.style.display !== "grid") {
            $options.style.display = "grid";
        } else {
            $options.style.display = "none";
        }
    };
    $("#toggle_options").addEventListener("click", toggleOptions);
    $("#options_actions_save").addEventListener("click", toggleOptions);
    Object.entries(checkboxKeyMap).forEach(([selector, storageKey]) => {
        $(`#${selector}`).addEventListener("change", (e) => {
            store(storageKey, e.currentTarget.checked);
        });
    });
    Object.entries(inputKeyMap).forEach(([selector, storageKey]) => {
        $(`#${selector}`).addEventListener("change", (e) => {
            store(storageKey, e.currentTarget.value);
        });
    });
}

