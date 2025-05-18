export function StartGame(currentRoom, player, ws) {
      ws.send(JSON.stringify({
            type: "board-server",
            board: currentRoom.Board,
      }));
      currentRoom.Players.forEach((p) => {
            if (p.id == player.id) return;
            ws.send(JSON.stringify({
                  type: "join-server",
                  name: p.name,
                  id: p.id,
                  pos: p.pos,
            }))
      })
      currentRoom.broadcast(JSON.stringify({
            type: "join-server",
            name: player.name,
            id: player.id,
            pos: player.pos,
      }));
}