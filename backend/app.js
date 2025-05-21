const WebSocket = require('ws');
const { JoinPlayer } = require('./join.js');
const { HandleAll } = require('./utils/ws.js');
const { StartGame } = require('./utils/run.js');


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
