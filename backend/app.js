const WebSocket = require('ws');
const { JoinPlayer } = require('./utils/join.js');
const { handlePlayerAction } = require('./utils/ws.js');
const { handlePlayerJoin } = require('./utils/run.js');


const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', (ws) => {
    try {
        const [player, currentRoom] = JoinPlayer(ws)
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (!data) return;
            handlePlayerAction(currentRoom, player, data);
            currentRoom.broadcast(JSON.stringify({
                type: "data-server",
                lifes: player.lifes,
                bombs: player.Bombs,
                flames: player.Flames,
            }));
        });
        handlePlayerJoin(currentRoom, player, ws);
    } catch (err) {
        console.log(err);
    }
});

console.log(`🚀 Websocket running at ws://0.0.0.0:8080`);
