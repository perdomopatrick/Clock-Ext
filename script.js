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

    const body = document.body;
    body.addEventListener("wheel", (event) => {
        // body.style.backgroundColor = "red";
        if (event.deltaY > 0) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    clock.style.fontSize = `${Math.max(15, parseFloat(clock.style.fontSize || 30) - 1)}px`;
                }, i * 20);
            }
        } else if (event.deltaY < 0) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    clock.style.fontSize = `${Math.min(150, parseFloat(clock.style.fontSize || 30) + 1)}px`;
                }, i * 20);
            }
        }
    });
});