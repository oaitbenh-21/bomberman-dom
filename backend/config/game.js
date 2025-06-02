import { v4 as uuidv4 } from 'uuid';


export class Room {
    constructor() {
        this.Board = this.createBoard();
        this.Players = [];
        this.Joining = 0;
        this.Connections = [];
        this.Waiting = true;
        this.Over = false;
        this.Timer;
    }

    checkWinner() {
        let livePlayers = 0
        this.Players.forEach((pl) => {
            if (pl.lifes > 0) livePlayers++
        })
        if (livePlayers == 1) {
            this.Waiting = true;
            return 1
        } else if (livePlayers == 0) {
            return 2
        }
        return 0
    }

    isValid(name) {
        let valid = true;
        if (name.length <= 2) {
            return false;
        }
        this.Players.forEach((p) => {
            if (p.name == name) {
                valid = false;
            }
        });
        return valid;
    }
    // it should be randomly generated
    createBoard() {
        let map = [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 2],
            [2, 9, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 9, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 9, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 9, 2],
            [2, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        ];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] == 0 && Math.random() > 0.4) map[y][x] = 3;
                if (map[y][x] == 9) map[y][x] = 0;
            }
        }
        return map
    }

    addPlayer(player, conn) {
        this.Players.push(player);
        this.Connections.push(conn);
        if (this.Timer) clearTimeout(this.Timer);
        if (this.Players.length >= 2) this.Timer = setTimeout(() => {
            setTimeout(() => {
                this.Waiting = false;
            }, 1000);
            this.broadcast(JSON.stringify({
                type: "waiting",
                time: 10,
            }))
        }, 1000)
        // this.broadcast(JSON.stringify({
        //     type: "count-server",
        //     count: this.Players.length,
        // }))
    }

    broadcast(message) {

        this.Connections.forEach((ws) => {
            ws.send(message)
        })
    }
}

export class Player {
    constructor(room, conn) {
        this.id = uuidv4();
        this.name = "";
        this.room = room;
        this.pos = this.assignStartPosition();
        this.Bombs = 1;
        this.lifes = 3;
        this.Flames = 1;
        this.Speed = 10;
        this.ws = conn;
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
                if (
                    board[Math.floor(newY / 40)][Math.floor(checkX / 40)] !== 0
                    &&
                    typeof board[Math.floor(newY / 40)][Math.floor(checkX / 40)] != "object"
                ) {
                    canMove = false;
                    break;
                }

                // Check bottom edge
                if (
                    board[Math.floor((newY + 29) / 40)][Math.floor(checkX / 40)] !== 0
                    &&
                    typeof board[Math.floor((newY + 29) / 40)][Math.floor(checkX / 40)] != "object"
                ) {
                    canMove = false;
                    break;
                }
            }

            // Check left and right edges
            if (canMove) {
                for (let i = 0; i <= checkPoints; i++) {
                    const checkY = newY + (i * 29 / checkPoints); // Points from top to bottom edge

                    // Check left edge
                    if (
                        board[Math.floor(checkY / 40)][Math.floor(newX / 40)] !== 0
                        &&
                        typeof board[Math.floor(checkY / 40)][Math.floor(newX / 40)] != "object"
                    ) {
                        canMove = false;
                        break;
                    }

                    // Check right edge
                    if (
                        board[Math.floor(checkY / 40)][Math.floor((newX + 29) / 40)] !== 0
                        &&
                        typeof board[Math.floor(checkY / 40)][Math.floor((newX + 29) / 40)] != "object"
                    ) {
                        canMove = false;
                        break;
                    }
                }
            }

            if (canMove) {
                if (typeof board[Math.floor(newY / 40)][Math.floor(newX / 40)] == "object") {
                    switch (board[Math.floor(newY / 40)][Math.floor(newX / 40)].name) {
                        case "bombs":
                            this.Bombs++;
                            break;
                        case "speed":
                            this.Speed += 5;
                            setTimeout(() => {
                                this.Speed -= 5;
                            }, 5000);
                            break;
                        case "lifes":
                            this.lifes++;
                            break;
                        case "flames":
                            this.Flames++;
                            setTimeout(() => {
                                this.Flames--;
                            }, 3000);
                            break;
                        default:
                            break;
                    }
                    this.room.broadcast(JSON.stringify({
                        type: "kill-server",
                        id: board[Math.floor(newY / 40)][Math.floor(newX / 40)].id,
                    }));
                    board[Math.floor(newY / 40)][Math.floor(newX / 40)] = 0;
                }
                this.pos.x = newX;
                this.pos.y = newY;
                return true;
            }
        }

        return false;
    }

    Left() { return this.move(-this.Speed, 0); }
    Right() { return this.move(this.Speed, 0); }
    Top() { return this.move(0, -this.Speed); }
    Bottom() { return this.move(0, this.Speed); }
}
