import { setPlayers, setPlayerPosition } from "../components/players.js";

export default class SocketHandler {
  constructor(socket, gameState, renderCallback) {
    this.socket = socket;
    this.gameState = gameState;
    this.render = renderCallback;
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    switch (message.type) {
      case "board-server":
        this.gameState.getState().board = message.board;
        break;

      case "chat-server":
        this.gameState.addMessage(message);
        break;

      case "data-server": {
        const state = this.gameState.getState();
        state.gameData.lifes = message.lifes;
        state.gameData.bombs = message.bombs;
        break;
      }

      case "count-server":
        this.gameState.getState().gameData.count = message.count;
        break;

      case "join-server": {
        const state = this.gameState.getState();
        state.players = [...state.players, message];
        setPlayers(state.players);
        state.countDown.timer = 4;

        if (state.players.length >= 2 && !state.countDown.id) {
          state.countDown.id = setInterval(() => {
            state.countDown.timer--;
            if (state.countDown.timer >= 0) {
              state.status = {
                title: "Starting...",
                message: `Waiting ${state.countDown.timer}`,
                number: 0,
              };
            } else {
              state.status = {
                title: "Game Started",
                message: "",
                number: 1,
              };
              clearInterval(state.countDown.id);
              state.countDown.id = null;
            }
            this.render();
          }, 1000);
        }
        break;
      }

      case "kill-server": {
        const state = this.gameState.getState();
        state.players = state.players.filter(p => p.id !== message.id);
        state.skills = state.skills.filter(s => s.id !== message.id);
        state.effect = message.pos;
        break;
      }

      case "skill-server":
        this.gameState.getState().skills.push(message);
        break;

      case "bomb-server": {
        const bombs = this.gameState.getState().bombs;
        const index = bombs.length;
        this.gameState.addBomb({ ...message, id: index });
        setTimeout(() => {
          this.gameState.getState().bombs = this.gameState
            .getState()
            .bombs.filter(bomb => bomb.id !== index);
          this.render();
        }, 2000);
        break;
      }

      case "remove-server": {
        const state = this.gameState.getState();
        state.board[message.y][message.x] = 0;
        if (message.pos) {
          const index = state.effects.length;
          state.effects.push({ ...message, id: index });
          setTimeout(() => {
            state.effects = state.effects.filter(e => e.id !== index);
            this.render();
          }, 400);
        }
        break;
      }

      case "move-server": {
        setPlayerPosition(message.player.id, message.player.pos);
        break;
      }

      case "gameover-server":
        this.gameState.getState().status = {
          number: 0,
          title: "Game Over",
          message: `the Winner is ${message.winner}`,
        };
        break;

      default:
        console.warn("Unhandled WebSocket message:", message);
        break;
    }

    this.render();
  }

  setup() {
    this.socket.onMessage((data) => this.handleMessage(data));
  }
}
