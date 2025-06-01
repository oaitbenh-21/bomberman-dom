import {
    events,
    createStore,
} from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.10/dist/mini-framework-z01.min.js";

import Socket from "./src/socket.js";
import GameState from "./managers/state-manager.js";
import SocketHandler from "./managers/socket-manager.js";
import ControlHandler from "./managers/controle-manager.js";
import renderUI from "./managers/ui-manager.js";

class App {
    constructor() {
        this.event = events;
        this.isChating = createStore(false);
        this.container = document.getElementById("app");

        // Game loop controls
        this.FPS = 16;
        this.frameInterval = 1000 / this.FPS;
        this.lastFrameTime = 0;
        this.animationFrameId = null;
        this.isRunning = false;
        this.moveNumber = 0;
        this.gameState = new GameState();
        this.socket = new Socket();

        this.sendMove = this.sendMove.bind(this);
        this.dropBomb = this.dropBomb.bind(this);
        this.render = renderUI.bind( this, this.container, this.gameState.state, this.socket, this.isChating);
        this.gameLoop = this.gameLoop.bind(this); 
    }

    sendMove(direction) {
        this.socket.send(JSON.stringify({ type: "move-client", direction }));
    }

    dropBomb() {
        this.socket.send(JSON.stringify({ type: "bomb-client" }));
    }

    init() {
        this.socketHandler = new SocketHandler(this.socket,this.gameState,this.render);
        this.socketHandler.setup();

        this.controlHandler = new ControlHandler(
            this.event,
            this.isChating,
            this.sendMove,
            this.dropBomb,
            this.gameState
        );

        this.startGameLoop();
    }

    startGameLoop() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    gameLoop() {
        if (this.moveNumber == 10) {
            Object.entries(this.gameState.state.Movement).forEach(([key, value]) => {
                if (value) {
                    this.sendMove(key);
                } else {
                    this.gameState.removeMoveDirection(key);
                }
            });
            this.moveNumber = 0;
        }
        this.moveNumber++;
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    scheduleRender() {
        // If game loop isn't running, start it
        if (!this.isRunning) {
            this.startGameLoop();
        }
    }


    destroy() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.controlHandler.destroy();
        this.socket.close();
    }
}

const app = new App();
app.init();
