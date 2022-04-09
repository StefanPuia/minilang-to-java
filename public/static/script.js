const $ = (...args) => document.querySelector(...args);
const aceSession = (id) => ace.edit(id).getSession();
const store = (key, val) => localStorage.setItem(key, val);
const get = (key) => localStorage.getItem(key) ?? "";
const getBoolean = (key) => localStorage.getItem(key) === "true";

const checkboxKeyMap = {
    logging_deprecated: "editor.logging.deprecated",
    logging_info: "editor.logging.info",
    logging_warning: "editor.logging.warning",
    converter_authServices: "editor.converter.authServices",
    converter_replicateMinilang: "editor.converter.replicateMinilang",
}

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
        ...options,
        mode: "ace/mode/xml",
    });

    ace.edit("output", {
        ...options,
        mode: "ace/mode/java",
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

            await fetch("/convert", {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input,
                    className: $className.value,
                    methodMode: $methodMode.value,
                    logging: {
                        deprecated: getBoolean(checkboxKeyMap.logging_deprecated),
                        info: getBoolean(checkboxKeyMap.logging_info),
                        warning: getBoolean(checkboxKeyMap.logging_warning),
                    },
                    converter: {
                        authServices: getBoolean(checkboxKeyMap.converter_authServices),
                        replicateMinilang: getBoolean(checkboxKeyMap.converter_replicateMinilang),
                    },
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    aceSession("output").setValue(data?.output ?? data);
                })
        } catch (err) {
            console.trace(err);
            aceSession("output").setValue(err.toString());
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
}

function addEditorCollapseListener() {
    const $splitSizes = $("#controls #splitSizes");
    $splitSizes.addEventListener("input", (e) => {
        const $container = $("#container");
        const sizeMap = {
            [-1]: "10em 1fr",
            [0]: "1fr 1fr",
            [1]: "1fr 10em",
        };
        $container.style.gridTemplateColumns = sizeMap[$splitSizes.value];
        ["input", "output"].forEach((el) => {
            const session = aceSession(el);
            session.setWrapLimitRange(
                Math.max(session.getScreenLength(), 10),
                null
            );
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
}

function migrateStorage() {
    const storeVersion = (v) => store("storage.version", v);
    const version = get("storage.version") || "000";

    if (version < "001") {
        store(checkboxKeyMap.logging_deprecated, true);
        store(checkboxKeyMap.logging_info, true);
        store(checkboxKeyMap.logging_warning, true);
        storeVersion("001");
    }
}