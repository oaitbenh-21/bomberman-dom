import { createElement, render } from "../../mini-framework/src/mini-framework-z01.js";

export default function renderPopup(gameState, container) {
    console.log('variables undefined', gameState, container)
    console.log('i have to start the waitting now ..........................')
    const state = gameState.getState();



    // if (currentInterval) {
    //     console.log('found interval in pop up room:', currentInterval)
    //     clearInterval(currentInterval);
    // }
    if (state.currentInterval) {
        console.log('found interval in the pop up:', state.currentInterval);
        clearInterval(state.currentInterval);
    }

    let countdown = 10;

    function renderCountdown() {
        console.log('the pop up 777 is rendered')
        const popup = createElement("div", { class: "popup" }, [
            createElement("span", { class: "countdown" }, [`The game will start in ${countdown}s...`])
        ]);
        render(popup, container);
    }

    renderCountdown();

    // gameState.getState().currentInterval = setInterval(() => {
    //     countdown--;
    //     renderCountdown();

    //     if (countdown <= 0) {
    //         clearInterval(gameState.getState().currentInterval);
    //     }
    // }, 1000);
}
