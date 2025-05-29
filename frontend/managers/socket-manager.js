// src/socket-handler.js
export default class SocketHandler {
    constructor(socket, gameState, renderCallback) {
        this.socket = socket;
        this.gameState = gameState;
        this.render = renderCallback;
    }

    handleMessage(data) {
        const message = JSON.parse(data);
        switch (message.type) {
            case "board-server":
                this.gameState.getState().board = message.board;
                break;
            case "chat-server":
                this.gameState.addMessage(message);
                break;
            case "data-server":
                const state = this.gameState.getState();
                state.gameData.lifes = message.lifes;
                state.gameData.bombs = message.bombs; // Correct place
                break;
            case "count-server":
                this.gameState.getState().gameData.count = message.count;
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
                        this.gameState.getState().status.title = "Starting...";
                        this.gameState.getState().status.message = `Waiting ${this.gameState.getState().countDown.timer
                            }`;
                        this.gameState.getState().status.number = 0;
                    } else {
                        this.gameState.getState().status.title = "Game Started";
                        this.gameState.getState().status.message = "";
                        this.gameState.getState().status.number = 1;
                        clearInterval(this.gameState.getState().countDown.id);
                    }
                };
                if (this.gameState.getState().players.length >= 2) {
                    if (this.gameState.getState().countDown.id == undefined) {
                        this.gameState.getState().countDown.id = setInterval(count, 1000);
                    }
                }
                break;
            case "kill-server":
                this.gameState.getState().players = this.gameState.getState().players.filter((player) => player.id != message.id);
                this.gameState.getState().skills = this.gameState.getState().skills.filter((skill) => skill.id != message.id);
                if (this.gameState.getState().pos) {
                    this.gameState.getState().effect = message.pos;
                }
                break;
            case "skill-server":
                this.gameState.getState().skills = [
                    ...this.gameState.getState().skills,
                    message,
                ];
                break;
            case "bomb-server":
                const index = this.gameState.getState().bombs.length;
                this.gameState.addBomb({ ...message, id: index });
                setTimeout(() => {
                    this.gameState.getState().bombs = this.gameState
                        .getState()
                        .bombs.filter((bomb) => bomb.id != index);
                }, 2000);
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
                    }, 400);
                    this.socket.send(JSON.stringify({}));
                }
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
                break;
            case "gameover-server":
                this.gameState.getState().status = {
                    number: 0,
                    title: "Game Over",
                    message: `the Winner is ${message.winner}`,
                };
                break;
            default:
                console.error("There is Websocket Message you don't Handle it");
                console.log("Type : ", message);
                break;
        }
    }

    setup() {
        this.socket.onMessage((data) => this.handleMessage(data));
    }
}
