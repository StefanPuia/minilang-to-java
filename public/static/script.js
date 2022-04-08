initAceEditors();
addSubmitConvertListener();
loadStoredData();
addEditorCollapseListener();

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
    const $className = document.querySelector("#className");
    document.querySelector("#submit").addEventListener("click", async () => {
        try {
            document.querySelector("#submit").disabled = "disabled";
            const $methodMode = document.querySelector("#mode");
            const input = ace.edit("input").getSession().getValue();

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
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    ace.edit("output").getSession().setValue(data?.output ?? data);
                })
        } catch (err) {
            console.trace(err);
            ace.edit("output").getSession().setValue(err.toString());
        } finally {
            document.querySelector("#submit").disabled = undefined;
        }
    });
}

function loadStoredData() {
    ace.edit("input")
        .getSession()
        .setValue(localStorage.getItem("editor.inputText") ?? "");
    document.querySelector("#className").value = localStorage.getItem("editor.className") ?? "";
    document.querySelector("#mode").value = localStorage.getItem("editor.methodMode");
}

function addEditorCollapseListener() {
    const $splitSizes = document.querySelector("#controls #splitSizes");
    $splitSizes.addEventListener("input", (e) => {
        const $container = document.querySelector("#container");
        const sizeMap = {
            [-1]: "10em 1fr",
            [0]: "1fr 1fr",
            [1]: "1fr 10em",
        };
        $container.style.gridTemplateColumns = sizeMap[$splitSizes.value];
        ["input", "output"].forEach((el) => {
            const session = ace.edit(el).getSession();
            session.setWrapLimitRange(
                Math.max(session.getScreenLength(), 10),
                null
            );
        });
    });
}