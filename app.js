const WebSocket = require('ws');
const { JoinPlayer } = require('./frontend/join.js');
const { HandleAll } = require('./frontend/utils/ws.js');
const { StartGame } = require('./frontend/utils/run.js');


const wsServer = new WebSocket.Server({ port: 8080 });
wsServer.on('connection', (ws) => {
    try {
        const [player, currentRoom] = JoinPlayer(ws)
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (!data) return;
            HandleAll(currentRoom, player, data, ws);
        });
        StartGame(currentRoom, player, ws)
    } catch (err) {
        console.log(err);
    }
});

console.log(`🚀 Websocket running at localhost:8080`);
