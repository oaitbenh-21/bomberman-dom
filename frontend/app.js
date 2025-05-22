import { createElement, render } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";
import renderBoard from "./components/board.js";
import renderHeader from "./components/header.js";
import renderChat from "./components/chat.js";
import Socket from "./src/socket.js";

class EventManager {
    constructor() {
        this.customEvents = {};
        this.nativeListeners = new Map(); // Tracks native event handlers
    }

    isNativeEvent(eventName) {
        const nativeEvents = ['keydown', 'keyup', 'click', 'scroll', 'mousedown', 'mouseup'];
        return nativeEvents.includes(eventName);
    }

    on(eventName, callback, element = window) {
        if (!this.customEvents[eventName]) { // the event isn't registered
            this.customEvents[eventName] = []; // register the event

            // Setup native event listener if applicable
            if (this.isNativeEvent(eventName)) {
                const handler = (e) => this.emit(eventName, e);
                element.addEventListener(eventName, handler);
                this.nativeListeners.set(eventName, { element, handler });
            }
        }
        // event registered
        this.customEvents[eventName].push(callback); // overite the event 
    }

    off(eventName, callback) {
        if (!this.customEvents[eventName]) return;

        // Remove the callback
        this.customEvents[eventName] = this.customEvents[eventName].filter(
            cb => cb !== callback
        );

        // If no more callbacks, remove native listener
        if (this.customEvents[eventName].length === 0) {
            const nativeListener = this.nativeListeners.get(eventName);
            if (nativeListener) {
                nativeListener.element.removeEventListener(eventName, nativeListener.handler);
                this.nativeListeners.delete(eventName);
            }
            delete this.customEvents[eventName];
        }
    }

    emit(eventName, data) {
        const listeners = this.customEvents[eventName];
        if (listeners) {
            listeners.forEach(cb => cb(data));
        }
    }
}


class App {
    constructor() {
        this.event = new EventManager();
        this.setupControls();


        this.state = {
            player: "Player 1",
            players: [],
            skills: [],
            board: [],
            gameData: {
                count: 0,
                time: "00:00",
                lifes: 0,
                bombs: 0,
            },
            messages: [{ username: 'System', message: 'Welcome to the chat!' }],
        };
        this.container = document.getElementById("app");
        this.boardGrade = [];
        this.socket = null;
    }
    sendMove(direction) {
        this.socket.send(JSON.stringify({ type: 'move-client', direction }));
    }
    setupControls() {
        const move = (e) => {
            switch (e.key) {
                case "ArrowDown":
                    this.sendMove("b");
                    break;
                case "ArrowUp":
                    this.sendMove("t");
                    break;
                case "ArrowLeft":
                    this.sendMove("l");
                    break;
                case "ArrowRight":
                    this.sendMove("r");
                    break;
                case " ":
                    this.socket.send(JSON.stringify({ type: "bomb-client" }));
                    break;
            }
        };

        // Register 'keydown' handler; EventManager handles the native listener
        this.event.on("keydown", move); // Uses default window as the element
    }

    init() {
        this.socket = new Socket();

        this.socket.onOpen((event) => {
            console.log("WebSocket connection opened:", event);
        });
        this.socket.onMessage((data) => {
            const message = JSON.parse(data);
            switch (message.type) {
                case "board-server":
                    this.state.board = message.board;
                    this.render();
                    break;
                case "chat-server":
                    this.state.messages.push(message);
                    this.render();
                    break;
                case "data-server":
                    this.state.gameData.lifes = message.lifes;
                    this.state.gameData.bombs = message.bombs;
                    this.render();
                    break;
                case "count-server":
                    this.state.gameData.count = message.count;
                    this.render();
                    break;
                case "join-server":
                    this.state.players = [...this.state.players, message];
                    this.render();
                    break;
                case "kill-server":
                    this.state.players = this.state.players.filter((player) => player.id != message.id);
                    this.state.skills = this.state.skills.filter((skill) => skill.id != message.id);
                    if (this.state.pos) {
                        this.state.effect = message.pos
                    }
                    this.render();
                    break;
                case "skill-server":
                    this.state.skills = [...this.state.skills, message];
                    this.render();
                    break;
                case "remove-server":
                    this.state.board[message.y][message.x] = 0;
                    this.render();
                    break;
                case "move-server":
                    this.state.players = this.state.players.map((player) => {
                        if (player.id === message.player.id) {
                            return { ...player, pos: message.player.pos };
                        }
                        return player;
                    });
                    this.render();
                    break;
                default:
                    break;
            }
        });
        this.socket.onClose((event) => {
            console.log("WebSocket connection closed:", event);
        });

        this.socket.onError((event) => {
            console.error("WebSocket error:", event);
            createElement("div", { class: "error" }, "WebSocket error. Please refresh the page.");
        });

        this.render();
        // Added cleanup method
    }

    render() {
        const board = this.state.board.length ? this.state.board : this.boardGrade;
        const { gameData, messages, players } = this.state;

        const appElement = createElement("div", { class: "container" }, [
            renderHeader(gameData),
            createElement("div", { class: "game" }, [
                renderBoard(board, players),
                renderChat(messages, this.socket)
            ])
        ]);

        render(appElement, this.container);
    }
    // Added cleanup method
    destroy() {
        this.event.off("keydown", this.moveHandler);
        this.socket.close();
    }
}

const app = new App();
app.init();
