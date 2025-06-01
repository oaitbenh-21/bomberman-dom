export function handlePlayerJoin(currentRoom, player, ws) {
      // Sends the game board to the player who joined
      let boxes = [];
      // console.log(currentRoom.Board);

      currentRoom.Board.forEach((row = [], y) => {
            row.forEach((data, x) => {
                  if (data == 3) {
                        boxes.push({ id: y * 17 + x, pos: { y: y, x: x } })
                  }
            })
      });

      ws.send(JSON.stringify({
            type: "board-server",
            board: boxes,
      }));

      // Sends info about all existing players in the room to the new player
      currentRoom.Players.forEach((p) => {
            if (p.id == player.id) return;
            ws.send(JSON.stringify({
                  type: "join-server",
                  name: p.name,
                  id: p.id,
                  pos: p.pos,
            }))
      })

      // Broadcasts info about the new player to everyone else in the room:
      currentRoom.broadcast(JSON.stringify({
            type: "join-server",
            name: player.name,
            id: player.id,
            pos: player.pos,
      }));
}