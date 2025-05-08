export function BombPositions(BombPos, currentRoom) {
    setTimeout(() => {
        let xPos = Math.floor(BombPos.x / 40)
        let yPos = Math.floor(BombPos.y / 40)
        currentRoom.broadcast(JSON.stringify({
            type: "remove",
            x: xPos,
            y: yPos,
            pos: { left: xPos * 40, top: yPos * 40 }
        }));
        for (let i = 1; i <= 1; i++) {
            for (let n of [-1, 1]) {
                [{ y: yPos + (n * i), x: xPos },
                { y: yPos, x: xPos + (n * i) }].forEach(coord => {
                    if (currentRoom.Board[coord.y][coord.x] != 2) {
                        currentRoom.broadcast(JSON.stringify({
                            type: "remove",
                            x: coord.x,
                            y: coord.y,
                            pos: { left: coord.x * 40, top: coord.y * 40 }
                        }));
                        currentRoom.Board[coord.y][coord.x] = 0;
                    }
                });
            }
        }
    }, 2000);
}