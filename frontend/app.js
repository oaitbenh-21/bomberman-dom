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

class App {
    constructor() {
        this.event = events;
        this.isChating = createStore(false);

        this.setupControls();

        // is the user chatting or playing

        this.state = {
            player: "Player 1",
            players: [],
            skills: [],
            effects: [],
            bombs: [],
            board: [],
            countDown: {
                id: undefined,
                timer: 4,
            },
            status: {
                number: 0,
                title: "Waiting Room",
                message: "Waiting for players",
            },
            message: "message",
            winner: "",
            gameData: {
                count: 0,
                time: "00:00",
                lifes: 0,
                bombs: 0,
            },
            messages: [{ username: "System", message: "Welcome to the chat!" }],
        };
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
                    this.state.countDown.timer = 4;
                    let count = () => {
                        this.state.countDown.timer--;
                        if (this.state.countDown.timer >= 0) {
                            this.state.status.title = "Starting...";
                            this.state.status.message = `Waiting ${this.state.countDown.timer}`;
                            this.state.status.number = 0;
                            this.render();
                        } else {
                            this.state.status.title = "Game Started";
                            this.state.status.message = "";
                            this.state.status.number = 1;
                            this.render();
                            clearInterval(this.state.countDown.id);
                        }
                        this.render();
                    };
                    if (this.state.players.length >= 2) {
                        if (this.state.countDown.id == undefined) {
                            this.state.countDown.id = setInterval(count, 1000);
                        }
                    }
                    this.render();
                    break;
                case "kill-server":
                    this.state.players = this.state.players.filter(
                        (player) => player.id != message.id
                    );
                    this.state.skills = this.state.skills.filter(
                        (skill) => skill.id != message.id
                    );
                    if (this.state.pos) {
                        this.state.effect = message.pos;
                    }
                    this.render();
                    break;
                case "skill-server":
                    this.state.skills = [...this.state.skills, message];
                    this.render();
                    break;
                case "bomb-server":
                    const index = this.state.bombs.length;
                    this.state.bombs = this.state.bombs.push({
                        ...message,
                        id: index,
                    });
                    setTimeout(() => {
                        this.state.bombs = this.state.bombs.filter(
                            (bomb) => bomb.id != index
                        );
                        this.render();
                    }, 2000);
                    this.render();
                    break;
                case "remove-server":
                    this.state.board[message.y][message.x] = 0;
                    if (this.state.pos) {
                        const index = this.state.effects.length;
                        this.state.effects = { ...message, id: index };
                        setTimeout(() => {
                            this.state.effects = this.state.effects.filter(
                                (effect) => effect.id != index
                            );
                            this.render();
                        }, 400);
                    }
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
                case "gameover-server":
                    this.state.status = {
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
        console.log("rendering...");
        console.log("isChating", this.isChating);

        const board = this.state.board.length
            ? this.state.board
            : this.boardGrade;
        const { gameData, messages, players, skills, status, bombs, effects } =
            this.state;
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
