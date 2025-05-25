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

        this.gameState = new GameState();
        this.socket = new Socket();

        this.sendMove = this.sendMove.bind(this);
        this.dropBomb = this.dropBomb.bind(this);
        this.render = this.render.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
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
            () => this.scheduleRender() // Schedule render on state changes
        );
        this.socketHandler.setup();

        this.controlHandler = new ControlHandler(
            this.event,
            this.isChating,
            this.sendMove,
            this.dropBomb
        );

        this.startGameLoop();
    }

    startGameLoop() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        // this.render(); // Initial render
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calculate time since last frame
        const deltaTime = timestamp - this.lastFrameTime;

        // Run at 16 FPS (62.5ms per frame)
        if (deltaTime >= this.frameInterval) {
            console.log(`Frame time: ${deltaTime.toFixed(2)}ms`);
            this.render();
            this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);
        }

        // Keep requesting new frames
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    scheduleRender() {
        // If game loop isn't running, start it
        if (!this.isRunning) {
            this.startGameLoop();
        }
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
