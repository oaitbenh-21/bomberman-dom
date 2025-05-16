import { BombPositions } from './bomb.js';
import { MovePlayer } from './move.js';

export function HandleAll(currentRoom, player, data, ws) {
      if (data.type == "chat") {
            let len = data.message.trim().length;
            if (len < 2 || len > 50) return;
            currentRoom.broadcast(JSON.stringify({
                  type: "chat",
                  sender: player.name,
                  message: data.message,
            }))
      }
      if (currentRoom.Waiting || player.lifes < 1) return
      switch (data.type) {
            case "bomb":
                  if (player.Bombs <= 0) return;
                  player.Bombs--;
                  const BombPos = { x: player.pos.x, y: player.pos.y };
                  currentRoom.broadcast(JSON.stringify({
                        type: "bomb",
                        pos: BombPos,
                  }));
                  BombPositions(BombPos, currentRoom, player.Flames);
                  break;
            case "move":
                  MovePlayer(data, player, currentRoom);
                  break;
            case "data":
                  ws.send(JSON.stringify({
                        type: "data",
                        lifes: player.lifes,
                        bombs: player.Bombs,
                        flames: player.Flames,
                  }));
            default:
                  break;
      }
}