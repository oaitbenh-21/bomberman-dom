import { v4 as uuidv4 } from 'uuid';
export class Room {
    constructor() {
        this.Board = this.createBoard();
        this.Players = [];
        this.Connections = [];
    }

    createBoard() {
        return [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 3, 2, 0, 2, 3, 2, 3, 2, 3, 2, 0, 2],
            [2, 0, 0, 3, 3, 3, 0, 3, 0, 3, 0, 3, 0, 3, 3, 0, 2],
            [2, 0, 2, 0, 2, 3, 2, 3, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 3, 2, 0, 2, 3, 2, 0, 2, 3, 2, 0, 2],
            [2, 0, 0, 3, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        ];
    }

    addPlayer(player, conn) {
        this.Players.push(player);
        this.Connections.push(conn);
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
        this.Bombs = 1;
    }

    assignStartPosition() {
        const numPlayers = this.room.Players.length;
        switch (numPlayers) {
            case 0: return { x: 40, y: 40 };
            case 1: return { x: (this.room.Board[0].length - 2) * 40, y: 40 };
            case 2: return { x: 40, y: (this.room.Board.length - 2) * 40 };
            case 3: return { x: (this.room.Board[0].length - 2) * 40, y: (this.room.Board.length - 2) * 40 };
            default: return { x: 0, y: 0 };
        }
    }

    move(dx, dy) {
        const newX = this.pos.x + dx;
        const newY = this.pos.y + dy;
        const board = this.room.Board;
        if (newX >= 0 && newY >= 0 &&
            newX + 29 < board[0].length * 40 &&
            newY + 29 < board.length * 40) {

            // Define how many points to check along each edge
            const checkPoints = 4; // Check 4 points along each edge (including corners)
            let canMove = true;

            // Check top and bottom edges
            for (let i = 0; i <= checkPoints; i++) {
                const checkX = newX + (i * 29 / checkPoints); // Points from left to right edge

                // Check top edge
                if (board[Math.floor(newY / 40)][Math.floor(checkX / 40)] !== 0) {
                    canMove = false;
                    break;
                }

                // Check bottom edge
                if (board[Math.floor((newY + 29) / 40)][Math.floor(checkX / 40)] !== 0) {
                    canMove = false;
                    break;
                }
            }

            // Check left and right edges
            if (canMove) {
                for (let i = 0; i <= checkPoints; i++) {
                    const checkY = newY + (i * 29 / checkPoints); // Points from top to bottom edge

                    // Check left edge
                    if (board[Math.floor(checkY / 40)][Math.floor(newX / 40)] !== 0) {
                        canMove = false;
                        break;
                    }

                    // Check right edge
                    if (board[Math.floor(checkY / 40)][Math.floor((newX + 29) / 40)] !== 0) {
                        canMove = false;
                        break;
                    }
                }
            }

            if (canMove) {
                this.pos.x = newX;
                this.pos.y = newY;
                return true;
            }
        }

        return false;
    }

    Left() { return this.move(-10, 0); }
    Right() { return this.move(10, 0); }
    Top() { return this.move(0, -10); }
    Bottom() { return this.move(0, 10); }
}
