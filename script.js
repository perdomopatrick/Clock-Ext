document.addEventListener("DOMContentLoaded", () => {
    const clock = document.getElementById("clock");
    clock.textContent = new Date().toLocaleTimeString();

    const updateClock = () => {
        clock.textContent = new Date().toLocaleTimeString();
    };
    updateClock();
    setInterval(updateClock, 500);

    const button = document.getElementById("openSlides");
    button.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        let tab_url = tab.url;
        if (tab_url.includes("canvas.ubc.ca/courses/") && tab_url.includes("files/")) {
            chrome.scripting
                .executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const fileLink = document.querySelector("iframe[aria-label]");
                        if (fileLink) {
                            const srcValue = fileLink.src;
                            if (srcValue && srcValue.startsWith("https://")) {
                                window.open(srcValue, "_blank").focus();
                            }
                        }
                        return null;
                    }
                }).then(() => console.log("injected a function"))
                .catch((err) => console.error("Error injecting script:", err));
        }
        // chrome.tabs.create({ url: url });
    });
});