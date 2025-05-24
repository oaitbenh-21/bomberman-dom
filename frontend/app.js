import {
    createElement,
    render,
    events,
    createStore,
} from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.10/dist/mini-framework-z01.min.js";
import renderBoard from "./components/board.js";
import renderHeader from "./components/header.js";
import renderChat from "./components/chat.js";
import Socket from "./src/socket.js";
import GameState from "./state-manager.js";

class App {
    constructor() {
        this.event = events;
        this.isChating = createStore(false);

        this.setupControls();

        this.gameState = new GameState();

        this.container = document.getElementById("app");
        this.boardGrade = [];
        this.socket = null;
    }

    sendMove(direction) {
        this.socket.send(JSON.stringify({ type: "move-client", direction }));
    }

    setupControls() {
        console.log("this isChating controle:", this.isChating.getState());

        const move = (e) => {
            if (this.isChating.getState()) return;

            const keys = [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                " ",
            ];
            if (!keys.includes(e.key)) return;

            e.preventDefault(); // Stop scroll BEFORE anything else

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
                    console.log("bomb dropped!!");
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
                    this.gameState.getState().board = message.board;
                    this.render();
                    break;
                case "chat-server":
                    this.gameState.getState().messages.push(message);
                    this.render();
                    break;
                case "data-server":
                    this.gameState.getState().gameData.lifes = message.lifes;
                    this.gameState.getState().bombs = message.bombs;
                    this.render();
                    break;
                case "count-server":
                    this.gameState.getState().gameData.count = message.count;
                    this.render();
                    break;
                case "join-server":
                    this.gameState.getState().players = [
                        ...this.gameState.getState().players,
                        message,
                    ];
                    this.gameState.getState().countDown.timer = 4;
                    let count = () => {
                        this.gameState.getState().countDown.timer--;
                        if (this.gameState.getState().countDown.timer >= 0) {
                            this.gameState.getState().status.title =
                                "Starting...";
                            this.gameState.getState().status.message = `Waiting ${
                                this.gameState.getState().countDown.timer
                            }`;
                            this.gameState.getState().status.number = 0;
                            this.render();
                        } else {
                            this.gameState.getState().status.title =
                                "Game Started";
                            this.gameState.getState().status.message = "";
                            this.gameState.getState().status.number = 1;
                            this.render();
                            clearInterval(
                                this.gameState.getState().countDown.id
                            );
                        }
                        this.render();
                    };
                    if (this.gameState.getState().players.length >= 2) {
                        if (
                            this.gameState.getState().countDown.id == undefined
                        ) {
                            this.gameState.getState().countDown.id =
                                setInterval(count, 1000);
                        }
                    }
                    this.render();
                    break;
                case "kill-server":
                    this.gameState.getState().players = this.gameState
                        .getState()
                        .players.filter((player) => player.id != message.id);
                    this.gameState.getState().skills = this.gameState
                        .getState()
                        .skills.filter((skill) => skill.id != message.id);
                    if (this.gameState.getState().pos) {
                        this.gameState.getState().effect = message.pos;
                    }
                    this.render();
                    break;
                case "skill-server":
                    this.gameState.getState().skills = [
                        ...this.gameState.getState().skills,
                        message,
                    ];
                    this.render();
                    break;
                case "bomb-server":
                    const index = this.gameState.getState().bombs.length;
                    this.gameState.getState().bombs = [
                        ...this.gameState.getState().bombs,
                        { ...message, id: index },
                    ];
                    setTimeout(() => {
                        this.gameState.getState().bombs = this.gameState
                            .getState()
                            .bombs.filter((bomb) => bomb.id != index);
                        this.render();
                    }, 2000);
                    this.render();
                    break;
                case "remove-server":
                    this.gameState.getState().board[message.y][message.x] = 0;
                    if (message.pos) {
                        const index = this.gameState.getState().effects.length;
                        this.gameState.getState().effects = [
                            ...this.gameState.getState().effects,
                            { ...message, id: index },
                        ];
                        setTimeout(() => {
                            this.gameState.getState().effects = this.gameState
                                .getState()
                                .effects.filter((effect) => effect.id != index);
                            this.render();
                        }, 400);
                    }
                    this.render();
                    break;
                case "move-server":
                    this.gameState.getState().players = this.gameState
                        .getState()
                        .players.map((player) => {
                            if (player.id === message.player.id) {
                                return { ...player, pos: message.player.pos };
                            }
                            return player;
                        });
                    this.render();
                    break;
                case "gameover-server":
                    this.gameState.getState().status = {
                        number: 0,
                        title: "Game Over",
                        message: `the Winner is ${message.winner}`,
                    };
                    this.render();
                    break;
                default:
                    console.error(
                        "There is Websocket Message you don't Handle it"
                    );
                    console.log("Type : ", message);

                    break;
            }
        });
        this.socket.onClose((event) => {
            console.log("WebSocket connection closed:", event);
        });

        this.socket.onError((event) => {
            console.error("WebSocket error:", event);
            createElement(
                "div",
                { class: "error" },
                "WebSocket error. Please refresh the page."
            );
        });

        this.render();
        // Added cleanup method
    }

    render() {
        const state = this.gameState.getState();
        const board = state.board.length ? state.board : this.boardGrade;
        const { gameData, messages, players, skills, status, bombs, effects } =
            state;

        const appElement = createElement("div", { class: "container" }, [
            renderHeader(gameData),
            createElement("div", { class: "game" }, [
                renderBoard(
                    board,
                    players,
                    skills,
                    status,
                    bombs,
                    effects,
                    this.isChating
                ),
                renderChat(messages, this.socket, this.isChating),
            ]),
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
