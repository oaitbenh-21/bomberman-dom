import {
    createElement,
    render,
    events,
    createStore,
} from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.10/dist/mini-framework-z01.min.js";


import Socket from "./src/socket.js";
import GameState from "./managers/state-manager.js";
import SocketHandler from "./managers/socket-manager.js";
import ControlHandler from "./managers/controle-manager.js";
import renderUI from "./managers/ui-manager.js"


class App {
    constructor() {
        this.event = events;
        this.isChating = createStore(false);
        this.container = document.getElementById("app");

        this.gameState = new GameState();
        this.socket = new Socket();

        this.sendMove = this.sendMove.bind(this);
        this.dropBomb = this.dropBomb.bind(this);
        this.render = this.render.bind(this);
    }

    sendMove(direction) {
        this.socket.send(JSON.stringify({ type: "move-client", direction }));
    }

    dropBomb() {
        this.socket.send(JSON.stringify({ type: "bomb-client" }));
    }

    init() {
        this.socketHandler = new SocketHandler(
            this.socket,
            this.gameState,
            this.render
        );
        this.socketHandler.setup();

        this.controlHandler = new ControlHandler(
            this.event,
            this.isChating,
            this.sendMove,
            this.dropBomb
        );

        this.render();
    }

    render() {
        renderUI(
            this.container,
            this.gameState.getState(),
            this.socket,
            this.isChating
        );
    }

    destroy() {
        this.controlHandler.destroy();
        this.socket.close();
    }
}

const app = new App();
app.init();
