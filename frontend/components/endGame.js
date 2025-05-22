import { createElement } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";

export const endGame = (status) => {
    return createElement('div', { class: "GameStatus" }, [
        createElement('div', { class: "StausContainer", style: `display: ${status.number == 0 ? "flex" : "none"};` }, [
            createElement('div', { class: "title" }, status.title),
            createElement('div', { class: "message" }, status.message),
        ]),
    ]);
}