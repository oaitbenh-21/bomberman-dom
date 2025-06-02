export default class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.state = {
            Movement: {
                "t": false,
                "b": false,
                "l": false,
                "r": false,
            },
            moveNumber: 0,
            player: "",
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
    }

    getState() {
        return this.state;
    }

    addBomb(pos) {
        this.state.bombs.push(pos);
    }
    addMessage(message) {
        this.state.messages.push(message);
    }
    addMoveDirection(direction) {
        this.state.Movement[direction] = true;
    }
    removeMoveDirection(direction) {
        this.state.Movement[direction] = false;
    }
    updateBoard(board) {
        this.state.board = board;
    }

    addMessage(message) {
        this.state.messages.push(message);
    }
}
