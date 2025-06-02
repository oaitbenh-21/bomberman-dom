import { createElement } from "../../mini-framework/src/mini-framework-z01.js";

export const endGame = (status) => {
    return createElement('div', { class: "GameStatus" }, [
        createElement('div', { class: "StausContainer", style: `display: ${status.number == 0 ? "flex" : "none"};` }, [
            createElement('div', { class: "title" }, status.title),
            createElement('div', { class: "message" }, status.message),
        ]),
    ]);
}