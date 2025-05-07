function BombPositions(BombPos, currentRoom, delay) {
    setTimeout(() => {
        let xPos = Math.floor(BombPos.x / 40)
        let yPos = Math.floor(BombPos.y / 40)
        for (let i = 1; i <= 1; i++) {
            for (let n of [-1, 1]) {
                currentRoom.Players.forEach((p) => {

                })
                [{ y: yPos + (n * i), x: xPos },
                    { y: yPos, x: xPos + (n * i) }].forEach(coord => {
                        if (currentRoom.Board[coord.y][coord.x] == 3) {
                            currentRoom.broadcast(JSON.stringify({
                                type: "remove",
                                x: coord.x,
                                y: coord.y,
                                pos: { left: this.x * 40, top: this.y * 40 }
                            }));
                            currentRoom.Board[coord.y][coord.x] = 0;
                        }
                    });
            }
        }
        player.Bombs++;
    }, delay);
}