import {
    render,
    createElement,
} from "../../mini-framework/src/mini-framework-z01.js";
import renderHeader from "../components/header.js";
import renderChat from "../components/chat.js";
import renderBoard from "../components/board.js";


// src/ui-renderer.js
export default function renderUI(container, state, socket, isChating) {
    console.log("Rendering UI with state:", state);
    
    const board = state.board.length ? state.board : [];

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
