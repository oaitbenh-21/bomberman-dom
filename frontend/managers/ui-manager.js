import {
    render,
    createElement,
} from "../../mini-framework/src/mini-framework-z01.js";
import renderHeader from "../components/header.js";
import renderChat from "../components/chat.js";
import renderBoard from "../components/board.js";
import renderWelcome from "../components/Welcome.js";

export default function renderUI(container, gameState, socket, isChating) {
    console.log("Rendering UI with state:", gameState);
    const state = gameState.getState();
    const boxes = state.board.length ? state.board : [];
    const content = state.player ?
        createElement("div", { class: "container" }, [
            renderHeader(state.gameData),
            createElement("div", { class: "game" }, [
                renderBoard(
                    boxes,
                    state.players,
                    isChating
                ),
                renderChat(socket, isChating),
            ]),
        ])
        :
        renderWelcome(
            socket,
            gameState
        );

    render(content, container);
}
