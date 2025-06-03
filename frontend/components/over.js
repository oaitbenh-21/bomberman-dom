import { createElement, render } from "../../mini-framework/src/mini-framework-z01.js";

export default function renderPopup(_, container) {
    let countdown = 10;

    function renderCountdown() {
        const popup = createElement("div", { class: "popup" }, [
            createElement("span", { class: "countdown" }, [`the game will start in ${countdown}s...`])
        ]);
        render(popup, container);
    }

    renderCountdown();

    const interval = setInterval(() => {
        countdown--;
        renderCountdown();
        if (countdown <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}
