const WebSocket = require('ws');
const { Player, Room } = require('./frontend/config/game.js');
const { BombPositions } = require('./frontend/utils/utils.js');
const Rooms = [];
const Connections = [];
const wsServer = new WebSocket.Server({ port: 8080 });
const colors = ["red", "blue", "yellow", "green"];
wsServer.on('connection', (ws) => {
    try {
        Connections.push(ws)
        let currentRoom;
        let nowPlayer;
        const lastRoom = Rooms[Rooms.length - 1];
        console.log(lastRoom && lastRoom.Players.length < 4 || lastRoom && lastRoom.Waiting);
        if ((lastRoom && lastRoom.Players.length < 4 || lastRoom && lastRoom.Waiting) && lastRoom && !lastRoom.Over) {
            currentRoom = lastRoom;
            nowPlayer++;
        } else {
            currentRoom = new Room();
            Rooms.push(currentRoom);
            nowPlayer = 0;
        }
        if (currentRoom.Over) return;
        const player = new Player(currentRoom);
        player.color = colors[nowPlayer]
        currentRoom.addPlayer(player, ws);
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.type == "chat") {
                if (data.message.trim().length) return;
                currentRoom.broadcast(JSON.stringify({
                    type: "chat",
                    message: data.message,
                }))
            }
            if (currentRoom.Waiting || player.lifes < 1) return
            switch (data.type) {
                case "bomb":
                    // if (player.Bombs == 0) return;
                    // player.Bombs--;
                    const BombPos = { x: player.pos.x, y: player.pos.y };
                    currentRoom.broadcast(JSON.stringify({
                        ...data,
                        pos: BombPos,
                    }));
                    BombPositions(BombPos, currentRoom);
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
        });
        ws.send(JSON.stringify({
            type: "board",
            board: currentRoom.Board,
        }));
        currentRoom.Players.forEach((p) => {
            if (p.id == player.id) return;
            ws.send(JSON.stringify({
                type: "join",
                name: p.name,
                id: p.id,
                pos: p.pos,
            }))
        })
        currentRoom.broadcast(JSON.stringify({
            type: "join",
            name: player.name,
            id: player.id,
            pos: player.pos,
        }));
    } catch (err) {
        console.log(err);
    }
});

console.log(`🚀 Websocket running at localhost:8080`);
