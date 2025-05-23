export function handlePlayerJoin(currentRoom, player, ws) {
      // Sends the game board to the player who joined
      ws.send(JSON.stringify({
            type: "board-server",
            board: currentRoom.Board,
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