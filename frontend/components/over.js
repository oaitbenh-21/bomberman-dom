import { createElement, render } from "../../mini-framework/src/mini-framework-z01.js";


export default function renderPopup(gameState, container) {
    const state = gameState.getState();
    const status = state.status
    const popup =  createElement("div", { class: "popup" }, [createElement("span", { class: "title" }, [status.title]), createElement("span", { class: "content" }, [status.message])]);
    render(popup, container)
}