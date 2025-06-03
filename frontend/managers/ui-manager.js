import {
    render,
    createElement,
    effect,
} from "../../mini-framework/src/mini-framework-z01.js";
import renderHeader from "../components/header.js";
import renderChat from "../components/chat.js";
import renderBoard from "../components/board.js";
import { renderPopup } from "../components/over.js";

export default function initUI(container, gameState, socket, isChating) {
    const state = gameState.getState();
    const stop = effect(() => {
        // Decide what to render based on whether player is set
        const game = createElement("div", { class: "container" }, [
                renderHeader(state.gameData),
                createElement("div", { class: "game" }, [
                    renderBoard(
                        state.board,
                        state.players,
                        isChating
                    ),
                    renderChat(socket, isChating),
                    renderPopup(state.status),
                ]),
            ])
        render(game,container)        
    });
    setTimeout(() => {
        stop();
    }, 10000)
}

