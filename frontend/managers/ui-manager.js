import {
    render,
    createElement,
} from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.22/dist/mini-framework-z01.min.js";
import renderHeader from "../components/header.js";
import renderChat from "../components/chat.js";
import renderBoard from "../components/board.js";


// src/ui-renderer.js
export default function renderUI(container, state, socket, isChating) {
    const board = Array.isArray(state.board) && state.board.length ? state.board : [];

    const appElement = createElement("div", { class: "container" }, [
        renderHeader(state.gameData),
        createElement("div", { class: "game" }, [
            renderBoard(
                board,
                state.players,
                state.skills,
                state.status,
                state.bombs,
                state.effects,
                isChating
            ),
            renderChat(state.messages, socket, isChating),
        ]),
    ]);

    render(appElement, container);
    
}
