// var http = require('http');
// var fs = require('fs');
// http.createServer(function (req, res) {
//     console.log("." + req.url)
//     fs.readFile("." + req.url, function (err, data) {
//         if (err) console.log(err)
//         res.end(data)
//     });
// }).listen(8080, '0.0.0.0');
const WebSocket = require('ws');
const { Player, Room } = require('./frontend/game.js');

const Rooms = [];
const Connections = [];


const wsServer = new WebSocket.Server({ port: 8080 });



wsServer.on('connection', (ws) => {
    // handle new client
    Connections.push(ws)
    let currentRoom;
    const lastRoom = Rooms[Rooms.length - 1];
    if (lastRoom && lastRoom.Players.length < 4) {
        currentRoom = lastRoom;
    } else {
        currentRoom = new Room();
        Rooms.push(currentRoom);
    }

    const player = new Player(currentRoom);
    currentRoom.addPlayer(player);

    // handle recieve message
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            switch (data.type) {
                case "bomb":
                    // Add Bomb to now player position
                    break;
                case "move":
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
                    ws.send(JSON.stringify({
                        moved: move,
                        board: currentRoom.Board,
                        pos: player.pos,
                    }));
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error('Invalid JSON:', err);
        }
    });

    ws.send(JSON.stringify({
        board: currentRoom.Board,
        id: player.id,
        pos: player.pos,
    }));
});

console.log(`🚀 Websocket running at localhost:8080`);
