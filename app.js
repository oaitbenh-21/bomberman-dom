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
    if (lastRoom && lastRoom.Players.length < 4) {
        currentRoom = lastRoom;
        nowPlayer++;
    } else {
        currentRoom = new Room();
        Rooms.push(currentRoom);
        nowPlayer = 0;
    }
    const player = new Player(currentRoom);
    player.color = colors[nowPlayer]
    currentRoom.addPlayer(player, ws);

    // handle recieve message
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            switch (data.type) {
                case "bomb":
                    if (player.Bombs == 0) return
                    player.Bombs--;
                    const BombPos = { x: player.pos.x, y: player.pos.y };
                    currentRoom.broadcast(JSON.stringify({
                        type: "bomb",
                        pos: BombPos,
                    }))
                    setTimeout(() => {
                        for (let i = 1; i <= 1; i++) {
                            for (let n of [-1, 1]) {
                                currentRoom.broadcast(JSON.stringify({
                                    type: "remove",
                                    x: Math.floor(BombPos.x / 40) + (n * i),
                                    y: Math.floor(BombPos.y / 40),
                                }))
                                currentRoom.Board[Math.floor(BombPos.y / 40) + (n * i)][Math.floor(BombPos.y / 40)] = 0
                                currentRoom.broadcast(JSON.stringify({
                                    type: "remove",
                                    x: Math.floor(BombPos.x / 40),
                                    y: Math.floor(BombPos.y / 40) + (n * i),
                                }))
                                currentRoom.Board[Math.floor(BombPos.y / 40)][Math.floor(BombPos.y / 40) + (n * i)] = 0
                                // if (currentRoom.Board[Math.floor(BombPos.y / 40) + (n * i)][Math.floor(BombPos.y / 40)] == 3) {
                                    
                                //     console.log("bombed");

                                // }
                                // if (currentRoom.Board[Math.floor(BombPos.y / 40)][Math.floor(BombPos.y / 40) + (n * i)] == 3) {
                                    
                                //     console.log("bombed");
                                // }
                            }
                        }
                        player.Bombs++;
                    }, 2000);

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
        type: "board",
        board: currentRoom.Board,
    }));
    currentRoom.Players.forEach((p) => {
        if (p.id == player.id) return;
        ws.send(JSON.stringify({
            data: "added by me",
            type: "join",
            name: p.name,
            id: p.id,
            pos: p.pos,
        }))
        ws.send(JSON.stringify({ d: 'data d l9lawi' }))
    })
    currentRoom.broadcast(JSON.stringify({
        type: "join",
        name: player.name,
        id: player.id,
        pos: player.pos,
    }));
});

console.log(`🚀 Websocket running at localhost:8080`);
