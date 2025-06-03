import {
    createSignal,
} from "../../mini-framework/src/mini-framework-z01.js";



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
            currentInterval : null , // id 
            startTime: new Date(),
            moveNumber: 0,
            name: createSignal(""),
            player: "",
            players: [],
            gamers: createSignal([]),
            skills: [],
            effects: [],
            bombs: [],
            board: [],
            count: null,
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
