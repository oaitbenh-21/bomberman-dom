import { createElement, render } from "../../mini-framework/src/mini-framework-z01.js";

export default function renderPopup(gameState, container) {
    const state = gameState.getState();

    let currentInterval = state.currentInterval;

    if (currentInterval) {
        console.log('found interval in pop up room:', currentInterval)
        clearInterval(currentInterval);
    }
    if (state.currentInterval) {
        clearInterval(state.currentInterval);
        state.currentInterval = null;
    }

    let countdown = 10;

    function renderCountdown() {
        const popup = createElement("div", { class: "popup" }, [
            createElement("span", { class: "countdown" }, [`The game will start in ${countdown}s...`])
        ]);
        render(popup, container);
    }

    renderCountdown();

    gameState.getState().currentInterval = setInterval(() => {
        countdown--;
        renderCountdown();

        if (countdown <= 0) {
            clearInterval(gameState.getState().currentInterval);

        }
    }, 1000);

}
