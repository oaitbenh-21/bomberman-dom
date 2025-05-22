import { Player, Room } from '../config/game.js';
const Rooms = [];
const Connections = [];
const colors = ["red", "blue", "yellow", "green"];

// Room 
// Player 

export function JoinPlayer(ws) {
      Connections.push(ws) // add ws to the connection pool

      let currentRoom;
      let currentPlayer;
      // get last room index
      const lastRoom = Rooms[Rooms.length - 1];

      // check if possible to add to the last room
      if (lastRoom && lastRoom.Players.length < 4 && lastRoom.Waiting && !lastRoom.Over) {
            currentRoom = lastRoom;

            //currentPlayer++;  // i changed this because it could be undefined and it will cause something unexpected
            currentPlayer = lastRoom.Players.length;

      } else { // create new room 
            currentRoom = new Room();
            Rooms.push(currentRoom);
            currentPlayer = 0;
      }

      if (currentRoom.Over) return;

      // create a new player and set it's color
      const player = new Player(currentRoom, ws);
      player.color = colors[currentPlayer]

      // add the new player to the current room
      currentRoom.addPlayer(player, ws);

      return [player, currentRoom]
}