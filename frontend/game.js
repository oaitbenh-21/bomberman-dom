import { v4 as uuidv4 } from 'uuid';

export class Room {
    constructor() {
        this.Board = this.createBoard();
        this.Players = [];
        this.Connections = []
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

    addPlayer(player, ws) {
        this.Players.push(player);
        this.Connections.push(ws);
    }

    broadcast(message) {
        this.Connections.forEach((ws) => {
            ws.send(message)
        })
    }
}

export class Player {
    constructor(room) {
        this.id = uuidv4();
        this.name = `Player_${this.id.slice(0, 5)}`;
        this.room = room;
        this.pos = this.assignStartPosition();
        this.color = "red"
    }

    assignStartPosition() {
        const numPlayers = this.room.Players.length;
        switch (numPlayers) {
            case 0: return { x: 40, y: 40 };
            case 1: return { x: 11 * 40, y: 1 * 40 };
            case 2: return { x: 1 * 40, y: 9 * 40 };
            case 3: return { x: 11 * 40, y: 9 * 40 };
            default: return { x: 0, y: 0 };
        }
    }

    move(dx, dy) {
        const newX = this.pos.x + dx;
        const newY = this.pos.y + dy;

        const board = this.room.Board;
        console.log("pos X : ", newX);
        console.log("pos Y : ", newY);
        console.log("-------  conditions");
        console.log(Math.floor(newY / 40));
        console.log(board[Math.floor(newY / 40)][Math.floor(newX / 40)] === 0);


        if (
            newY >= 40 && newY < (board.length - 1) * 40 &&
            newX >= 40 && newX < (board[0].length - 1) * 40 &&
            board[Math.floor(newY / 40)][Math.floor(newX / 40)] === 0
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
