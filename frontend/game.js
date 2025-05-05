import { v4 as uuidv4 } from 'uuid';

export class Room {
    constructor() {
        this.Board = this.createBoard();
        this.Players = new Map();
    }

    createBoard() {
        return [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        ];
    }

    addPlayer(player) {
        this.Players.set(player.id, player);
    }
}

export class Player {
    constructor(room) {
        this.id = uuidv4();
        this.name = `Player_${this.id.slice(0, 5)}`;
        this.room = room;
        this.pos = this.assignStartPosition();
        this.pos.x *= 40
        this.pos.y *= 40
    }

    assignStartPosition() {
        const numPlayers = this.room.Players.size;
        switch (numPlayers) {
            case 0: return { x: 1, y: 1 };
            case 1: return { x: 11, y: 1 };
            case 2: return { x: 1, y: 9 };
            case 3: return { x: 11, y: 9 };
            default: return { x: 0, y: 0 };
        }
    }

    move(dx, dy) {
        const newX = this.pos.x + dx;
        const newY = this.pos.y + dy;

        const board = this.room.Board;
        if (
            newY >= 40 && newY < board.length * 39 &&
            newX >= 40 && newX < board[0].length * 39 &&
            board[newY][newX] === 0
        ) {
            this.pos.x = newX;
            this.pos.y = newY;
            return true;
        }
        return false;
    }

    Left() { return this.move(-10, 0); }
    Right() { return this.move(10, 0); }
    Top() { return this.move(0, -10); }
    Bottom() { return this.move(0, 10); }
}
