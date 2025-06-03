import { v4 } from 'uuid';
import { Player, Room } from '../config/game.js';
import { BombPositions } from './bomb.js';
import { MovePlayer } from './move.js';


// BombPositions
// MovePlayer


export function handlePlayerAction(currentRoom = new Room(), player = new Player(), data) {
      // handle chats
      if (data.type == "chat-client") {
            let len = data.message.trim().length;
            if (len < 2 || len > 50) return;
            currentRoom.broadcast(JSON.stringify({
                  type: "chat-server",
                  username: player.name,
                  message: data.message,
            }))
      }

      // handle player actions
      switch (data.type) {
            // case of bomming
            case "join-player":
                  if (!currentRoom.isValid(data.name) || player.name != "") {
                        player.ws.send(JSON.stringify({
                              type: "error",
                              error: "your name is alredy taken or its less then 3 characters"
                        }));
                        currentRoom.Joining--;
                        return;
                  }
                  player.name = data.name;
                  currentRoom.addPlayer(player);
                  let boxes = [];
                  // console.log(currentRoom.Board);

                  currentRoom.Board.forEach((row = [], y) => {
                        row.forEach((data, x) => {
                              if (data == 3) {
                                    boxes.push({ id: y * 17 + x, pos: { y: y, x: x } })
                              }
                        })
                  });

                  player.ws.send(JSON.stringify({
                        type: "board-server",
                        board: boxes,
                  }));

                  // Sends info about all existing players in the room to the new player
                  currentRoom.Players.forEach((p) => {
                        if (p.id == player.id) return;
                        player.ws.send(JSON.stringify({
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
                  break;
            case "bomb-client":
                  // don't move player if still waiting
                  if (currentRoom.Waiting || player.lifes < 1) return
                  if (player.Bombs < 1) break;
                  player.Bombs--;
                  setTimeout(() => {
                        player.Bombs++;
                  }, 2200);
                  const BombPos = { x: Math.floor(player.pos.x / 40) * 40 + 5, y: Math.floor(player.pos.y / 40) * 40 + 5 };
                  currentRoom.broadcast(JSON.stringify({
                        type: "bomb-server",
                        pos: { x: BombPos.x, y: BombPos.y },
                        id: v4(),
                  }));
                  BombPositions(BombPos, currentRoom, player.Flames);
                  break;
            // case of moving
            case "move-client":
                  // don't move player if still waiting
                  if (currentRoom.Waiting || player.lifes < 1) return
                  MovePlayer(data, player, currentRoom);
                  break;

            default:
                  break;
      }
}
