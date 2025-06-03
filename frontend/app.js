import {
    events,
    createStore,
} from "../mini-framework/src/mini-framework-z01.js"

import Socket from "./src/socket.js";
import GameState from "./managers/state-manager.js";
import SocketHandler from "./managers/socket-manager.js";
import ControlHandler from "./managers/controle-manager.js";
import renderUI from "./managers/ui-manager.js";
import { compareDatesAndFormat } from "./src/utils.js";
import { setHeaderData } from "./components/header.js";
import renderWelcome from "./components/Welcome.js";
import renderWaitingRoom from "./components/wiatingRoom.js";
import renderPopup from "./components/over.js";
import endGame from "./components/endGame.js"


class App {
    constructor() {
        this.event = events;
        this.isChating = createStore(false);
        console.log('this is the first time initilizing the is chatting:', this.isChating);
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
        this.welcom = renderWelcome.bind(this,this.socket,this.gameState,this.container)
        this.board = renderUI.bind(this, this.container, this.gameState, this.socket, this.isChating);
        this.waitingList = renderWaitingRoom.bind(this,this.gameState,this.container)
        this.countDown = renderPopup.bind(this,this.gameState,this.container)
        this.endGame = endGame.bind(this,this.gameState,this.container);
        this.gameLoop = this.gameLoop.bind(this);
        window.addEventListener('socket-ready', () => {
            this.welcom()
        });
    }

    sendMove(direction) {
        this.socket.send(JSON.stringify({ type: "move-client", direction }));
    }

    dropBomb() {
        this.socket.send(JSON.stringify({ type: "bomb-client" }));
    }

    init() {
        this.socketHandler = new SocketHandler(this.socket, this.gameState, this.board, this.welcom , this.waitingList,this.countDown,this.endGame);
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
        this.gameState.state.gameData.time = compareDatesAndFormat(this.gameState.state.startTime, new Date());
        setHeaderData(this.gameState.state.gameData);
        if (this.moveNumber == 5) {
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
