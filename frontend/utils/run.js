export function StartGame(currentRoom, player, ws) {
      ws.send(JSON.stringify({
            type: "board",
            board: currentRoom.Board,
      }));
      currentRoom.Players.forEach((p) => {
            if (p.id == player.id) return;
            ws.send(JSON.stringify({
                  type: "join",
                  name: p.name,
                  id: p.id,
                  pos: p.pos,
            }))
      })
      currentRoom.broadcast(JSON.stringify({
            type: "join",
            name: player.name,
            id: player.id,
            pos: player.pos,
      }));
}