const WebSocket = require('ws');
const { JoinPlayer } = require('./utils/join.js');
const { handlePlayerAction } = require('./utils/ws.js');


const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', (ws) => {
    try {
        const [player, currentRoom] = JoinPlayer(ws)
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (!data) return;
            handlePlayerAction(currentRoom, player, data);
            currentRoom.Players.forEach(pl => {
                pl.ws.send(JSON.stringify({
                    type: "data-server",
                    count: currentRoom.Players.length,
                    lifes: player.lifes,
                    bombs: player.Bombs,
                    flames: player.Flames,
                }));
            })
        });
    } catch (err) {
        console.log(err);
    }
});

console.log(`🚀 Websocket running at ws://0.0.0.0:8080`);
