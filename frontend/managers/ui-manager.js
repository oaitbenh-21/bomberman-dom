import {
    render,
    createElement,
} from "../../mini-framework/src/mini-framework-z01.js";
import renderHeader from "../components/header.js";
import renderChat from "../components/chat.js";
import renderBoard from "../components/board.js";
import renderWelcome from "../components/Welcome.js";

export default function renderUI(container, gameState, socket, isChating) {
    const state = gameState.getState();
    console.log("Rendering UI with state:", state);
    const boxes = state.board.length ? state.board : [];
    const content = state.player?
        createElement("div", { class: "container" }, [
            renderHeader(state.gameData),
            createElement("div", { class: "game" }, [
                renderBoard(
                    boxes,
                    state.players,
                    state.skills,
                    state.status,
                    state.bombs,
                    state.effects,
                    isChating
                ),
                renderChat(state.messages, socket, isChating),
            ]),
        ])
        :
        renderWelcome(
            state.player ||"",
            (name) => {
                gameState.getState().player = name
            },
            (name) => {
                socket.send(JSON.stringify({
                    type: "join-player",
                    name: name
                }));
            }
        );

    render(content, container);
}
