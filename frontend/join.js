import { Player, Room } from './config/game.js';
const Rooms = [];
const Connections = [];
const colors = ["red", "blue", "yellow", "green"];

export function JoinPlayer(ws) {
      Connections.push(ws)
      let currentRoom;
      let nowPlayer;
      const lastRoom = Rooms[Rooms.length - 1];
      if (lastRoom && lastRoom.Players.length < 4 && lastRoom.Waiting && !lastRoom.Over) {
            currentRoom = lastRoom;
            nowPlayer++;
      } else {
            currentRoom = new Room();
            Rooms.push(currentRoom);
            nowPlayer = 0;
      }
      if (currentRoom.Over) return;
      const player = new Player(currentRoom, ws);
      player.color = colors[nowPlayer]
      currentRoom.addPlayer(player, ws);
      return [player, currentRoom]
}