import { BombPositions } from './bomb.js';
import { MovePlayer } from './move.js';

export function HandleAll(currentRoom, player, data, ws) {
      if (data.type == "chat-client") {
            let len = data.message.trim().length;
            if (len < 2 || len > 50) return;
            currentRoom.broadcast(JSON.stringify({
                  type: "chat-server",
                  sender: player.name,
                  message: data.message,
            }))
      }
      if (currentRoom.Waiting || player.lifes < 1) return
      switch (data.type) {
            case "bomb-client":
                  if (player.Bombs < 1) break;
                  player.Bombs--;
                  setTimeout(() => {
                        player.Bombs++;
                  }, 2000);
                  const BombPos = { x: player.pos.x, y: player.pos.y };
                  currentRoom.broadcast(JSON.stringify({
                        type: "bomb-server",
                        pos: { x: BombPos.x, y: BombPos.y },
                  }));
                  BombPositions(BombPos, currentRoom, player.Flames);
                  break;
            case "move-client":
                  MovePlayer(data, player, currentRoom);
                  break;
            case "data-client":
                  ws.send(JSON.stringify({
                        type: "data-server",
                        lifes: player.lifes,
                        bombs: player.Bombs,
                        flames: player.Flames,
                  }));
            default:
                  break;
      }
}