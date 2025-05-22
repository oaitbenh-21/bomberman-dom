import { createElement, render } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";
import renderBoard from "./components/board.js";
import renderHeader from "./components/header.js";
import renderChat from "./components/chat.js";
import Socket from "./src/socket.js";


class App {
    constructor() {
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
    }
    sendMove(direction) {
        this.socket.send(JSON.stringify({ type: 'move-client', direction }));
    }
    init() {
        this.socket = new Socket();
        document.addEventListener("keydown", (e) => {
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
                    this.socket.send(JSON.stringify({
                        type: "bomb-client",
                    }));
                    break;
                default:
                    break;
            }
        });
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
}

const app = new App();
app.init();
