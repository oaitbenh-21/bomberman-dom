import { createElement, render } from "../../mini-framework/src/mini-framework-z01.js";

export default function renderPopup(_, container) {
    // Clear any existing countdown interval
    if (container._popupInterval) {
        clearInterval(container._popupInterval);
    }

    let countdown = 10;

    function renderCountdown() {
        const popup = createElement("div", { class: "popup" }, [
            createElement("span", { class: "countdown" }, [`The game will start in ${countdown}s...`])
        ]);
        render(popup, container);
    }

    renderCountdown();

    const interval = setInterval(() => {
        countdown--;
        renderCountdown();

        if (countdown <= 0) {
            clearInterval(interval);
            container._popupInterval = null;
        }
    }, 1000);

    // Save interval to container so we can clean it up next time
    container._popupInterval = interval;
}
