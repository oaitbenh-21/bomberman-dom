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
const colors = ["red", "blue", "yellow", "green"];


wsServer.on('connection', (ws) => {
    // handle new client
    Connections.push(ws)
    let currentRoom;
    let nowPlayer;
    const lastRoom = Rooms[Rooms.length - 1];
    // if (lastRoom && lastRoom.Players.length < 4) {
    //     currentRoom = lastRoom;
    //     nowPlayer++;
    // } else {
    currentRoom = new Room();
    Rooms.push(currentRoom);
    nowPlayer = 0;
    // }

    const player = new Player(currentRoom);
    player.color = colors[nowPlayer]
    currentRoom.addPlayer(player, ws);

    // handle recieve message
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data);
            switch (data.type) {
                case "bomb":
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
                    console.log(move);
                    
                    if (move) currentRoom.broadcast(JSON.stringify({
                        type: "move",
                        player: {
                            id: player.id,
                            pos: player.pos,
                        },
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
        type: "join",
        board: currentRoom.Board,
        players: currentRoom.Players.map((p) => {
            return {
                name: p.name,
                id: p.id,
                pos: p.pos,
                color: p.color,
            }
        }),
    }));
});

console.log(`🚀 Websocket running at localhost:8080`);
