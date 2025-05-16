export function MovePlayer(data, player, currentRoom) {
      let move;
      switch (data.direction) {
            case "r":
                  move = player.Right();
                  break;
            case "l":
                  move = player.Left();
                  break;
            case "t":
                  move = player.Top();
                  break;
            case "b":
                  move = player.Bottom();
                  break;
            default:
                  break;
      }
      if (move) currentRoom.broadcast(JSON.stringify({
            type: "move",
            player: {
                  id: player.id,
                  pos: player.pos,
            },
      }));
}