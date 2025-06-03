import {
    render,
    createElement,
    effect,
} from "../../mini-framework/src/mini-framework-z01.js";
import renderHeader from "../components/header.js";
import renderChat from "../components/chat.js";
import renderBoard from "../components/board.js";
import renderWelcome from "../components/Welcome.js";

export default function initUI(container, gameState, socket, isChating) {
    const state = gameState.getState();
    // This effect reruns when `player` changes
    const stop = effect(() => {
        // console.log('the effect works in render the ui but are the variables', container, gameState, socket, isChating)
        const playerName = state.name.get();

        //    /*  */ console.log('rendering the init ui, the state is :', playerName)

        // Decide what to render based on whether player is set
        const content = playerName
            ? createElement("div", { class: "container" }, [
                renderHeader(state.gameData),
                createElement("div", { class: "game" }, [
                    renderBoard(
                        state.board,
                        state.players,
                        isChating
                    ),
                    renderChat(socket, isChating),
                ]),
            ])
            : renderWelcome(socket, gameState); // show name input

        render(content, container); // this replaces the DOM content
        // stop the effect after rendering the main UI once
    });
    stop();
}

