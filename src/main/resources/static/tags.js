window.addEventListener("load", () => {
    const $tags = document.querySelectorAll("#tags .tag");
    const $wrapper = document.querySelector("#tag-display-wrapper");

    document.querySelector("#search-input").addEventListener("input", (e) => {
        $tags.forEach(tag => tag.classList.add("hidden"));
        const search = e.currentTarget.value.toLowerCase();
        const isOptimise = "optimise".startsWith(search);
        const isHandled = "handled".startsWith(search);
        $tags.forEach(tag => {
            if (tag.textContent.toLowerCase().includes(search)) {
                show(tag);
            } else if (isOptimise && tag.classList.contains("optimised")) {
                show(tag);
            } else if (isHandled && !tag.classList.contains("unhandled")) {
                show(tag);
            }
        });

        function show(tag) {
            tag.classList.remove("hidden");
        }
    });
    $tags.forEach(tag => {
        tag.addEventListener("click", (e) => {
            const $tag = e.currentTarget;
            document.querySelector(
                "#tag-display-title").textContent = $tag.textContent;
            document.querySelector(
                "#tag-display-description").textContent = $tag.title || "";
            $wrapper.style.display = "grid";
        });

    });
    $wrapper.addEventListener("click", (e) => {
        if (e.currentTarget === e.target) {
            $wrapper.style.display = "none";
        }
    })
});
