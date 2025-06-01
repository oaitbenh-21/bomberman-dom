import { v4 } from "uuid";

let skills = [undefined, undefined, undefined, undefined, "flames", "bombs", "speed", "lifes"];

export function BombPositions(BombPos, currentRoom, flames) {
    setTimeout(() => {
        let xPos = Math.floor(BombPos.x / 40)
        let yPos = Math.floor(BombPos.y / 40)
        currentRoom.broadcast(JSON.stringify({
                    type: "remove-server",
                    remove: { id: yPos * 17 + xPos, },
                    effect: { id: v4(), pos: { left: xPos * 40, top: yPos * 40 } }
                }));
        let winner = "draw";
        currentRoom.Players.forEach((player) => {
            if (Math.floor(player.pos.x / 40) == xPos && Math.floor(player.pos.y / 40) == yPos) {
                player.lifes--;
                if (player.lifes <= 0) {
                    currentRoom.broadcast(JSON.stringify({
                        type: "kill-server",
                        id: player.id,
                    }));
                } else {
                    winner = player.name;
                }
            }
        });
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 }   // Right
        ];
        directions.forEach((dir) => {
            for (let i = 1; i <= flames; i++) {
                let coord = { y: yPos + (dir.y * i), x: xPos + (dir.x * i) };
                if (currentRoom.Board[coord.y][coord.x] == 2) return;
                currentRoom.Players.forEach((player) => {
                    if (Math.floor(player.pos.x / 40) == coord.x && Math.floor(player.pos.y / 40) == coord.y) {
                        player.lifes--;
                        if (player.lifes == 0) {
                            currentRoom.broadcast(JSON.stringify({
                                type: "kill-server",
                                id: player.id,
                            }));
                        }
                    } else {
                        winner = player.name;
                    }
                });
                currentRoom.broadcast(JSON.stringify({
                    type: "remove-server",
                    remove: { id: coord.y * 17 + coord.x, },
                    effect: { id: v4(), pos: { left: coord.x * 40, top: coord.y * 40 } }
                }));
                let skillindex = Math.floor(Math.random() * 10);
                let id = v4();
                if (skills[skillindex] && currentRoom.Board[coord.y][coord.x] == 3) {
                    currentRoom.Board[coord.y][coord.x] = {
                        name: skills[skillindex],
                        id: id,
                    };
                    currentRoom.broadcast(JSON.stringify({
                        type: "skill-server",
                        name: skills[skillindex],
                        id: id,
                        pos: { x: (coord.x * 40), y: (coord.y * 40) },
                    }));
                } else if (typeof currentRoom.Board[coord.y][coord.x] != "object") {
                    currentRoom.Board[coord.y][coord.x] = 0;
                }
            }
        });

        if (currentRoom.checkWinner() == 0) return;
        currentRoom.Over = true;
        currentRoom.broadcast(JSON.stringify({
            type: "gameover-server",
            winner: winner,
        }));
    }, 2000);
}