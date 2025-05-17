import { v4 as uuidv4 } from 'uuid';
export class Room {
    constructor() {
        this.Board = this.createBoard();
        this.Players = [];
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
            this.Over = true;
            return 1
        } else if (livePlayers == 0) {
            return 2
        }
        return 0
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
        if (this.Timer) clearTimeout(this.Timer);
        if (this.Players.length >= 2) this.Timer = setTimeout(() => {
            this.Waiting = false;
        }, 5000)
        this.broadcast(JSON.stringify({
            type: "count",
            count: this.Players.length,
        }))
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
        this.name = `Player_${this.id.slice(0, 5)}`;
        this.room = room;
        this.pos = this.assignStartPosition();
        this.Bombs = 100;
        this.lifes = 3;
        this.Flames = 1;
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
        const width = 30; // Entity width (30 pixels)
        const height = 30; // Entity height (30 pixels)
        const board = this.room.Board;
        const tileSize = 40; // Size of each board tile
        let skill = "";

        // Check if new position is within board boundaries
        if (newX < 0 || newY < 0 ||
            newX + width - 1 >= board[0].length * tileSize ||
            newY + height - 1 >= board.length * tileSize) {
            return { canMove: false, skill: skill };
        }

        // Define the number of points to check along each edge
        const checkPoints = 4;

        // Check all four edges for collisions
        const edges = [
            // Top edge: fixed y (newY), varying x
            { x: i => newX + (i * (width - 1) / checkPoints), y: () => newY },
            // Bottom edge: fixed y (newY + height - 1), varying x
            { x: i => newX + (i * (width - 1) / checkPoints), y: () => newY + height - 1 },
            // Left edge: fixed x (newX), varying y
            { x: () => newX, y: i => newY + (i * (height - 1) / checkPoints) },
            // Right edge: fixed x (newX + width - 1), varying y
            { x: () => newX + width - 1, y: i => newY + (i * (height - 1) / checkPoints) }
        ];

        // Check each edge for collisions
        for (const edge of edges) {
            for (let i = 0; i <= checkPoints; i++) {
                const checkX = edge.x(i);
                const checkY = edge.y(i);

                // Convert pixel coordinates to board indices
                const boardX = Math.floor(checkX / tileSize);
                const boardY = Math.floor(checkY / tileSize);

                // Get the tile at this position
                const tile = board[boardY][boardX];

                // Check if tile is a solid wall
                if (tile !== 0 && typeof tile !== "object") {
                    return { canMove: false, skill: skill };
                }
                // Check if tile is a collectible object
                else if (typeof tile === "object") {
                    skill = tile.skill;
                    board[boardY][boardX] = 0; // Collect the object
                }
            }
        }

        if (canMove) {
            switch (skill) {
                case "bombs":
                    this.Bombs++;
                    break;
                case "flames":
                    this.Flames++;
                    break;
                case "lifes":
                    this.lifes++;
                    break;
            }
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
