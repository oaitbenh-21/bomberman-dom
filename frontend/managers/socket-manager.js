import { setBombs } from "../components/bombs.js";
import { destroyBox, setBoxes } from "../components/box.js";
import { setEffect } from "../components/effect.js";
import { setPlayers, setPlayerPosition } from "../components/players.js";
import { destroySkill, setSkills } from "../components/skills.js";
import { setMessages } from "../components/chat.js";
import { setHeaderData } from "../components/header.js";
import { compareDatesAndFormat } from "../src/utils.js";



export default class SocketHandler {
  constructor(socket, gameState, renderCallback) {
    this.socket = socket;
    this.gameState = gameState;
    this.render = renderCallback;
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    switch (message.type) {
      case "board-server": destroyBox
        this.gameState.getState().board = message.board;
        setBoxes(message.board)
        // this.render();
        break;

      case "chat-server":
        // this.gameState.addMessage(message);
        // this.render();
        console.log('new message apreared ...')
        setMessages(message);
        break;

      case "data-server": {
        const state = this.gameState.getState();
        state.gameData.count = message.count;
        state.gameData.lifes = message.lifes;
        state.gameData.bombs = message.bombs;
        state.gameData.time = compareDatesAndFormat(this.gameState.getState().startTime, new Date());
        setHeaderData(message);
        break;
      }
      case "start-server": {
        this.gameState.getState().status = {
          number: 1,
          title: "Game Started",
          message: "The game has started!",
        };
        this.render();
        break;
      }
      case "join-server": {
        const state = this.gameState.getState();
        state.players = [...state.players, message];
        setPlayers(state.players);
        break;
      }

      case "kill-server": {
        const state = this.gameState.getState();
        state.players = state.players.filter(p => p.id !== message.id);
        state.skills = state.skills.filter(s => s.id !== message.id);
        state.effect = message.pos;
        console.log("kill-server message:", message);
        // destroySkill(state.skills);
        // setSkills(state.skills);
        destroySkill(message.id)
        break;
      }

      case "skill-server":
        this.gameState.getState().skills.push(message);
        console.log(this.gameState.getState().skills)
        setSkills(this.gameState.getState().skills);
        break;

      case "bomb-server": {
        console.log("bomb-server message:", message);
        const bombs = this.gameState.getState().bombs;
        const index = bombs.length;
        this.gameState.addBomb({ ...message, id: index });

        setBombs(message);

        setTimeout(() => {
          this.gameState.getState().bombs = this.gameState
            .getState()
            .bombs.filter(bomb => bomb.id !== index);
          // this.render();
        }, 2000);
        break;
      }

      case "remove-server": {
        let id = null;
        let pos = null;

        if (message?.remove?.id && message?.effect.pos) {
          id = message.remove.id
          pos = message.effect.pos
        }

        // const state = this.gameState.getState();
        // state.board[message.y][message.x] = 0;
        if (id && pos) {
          // const index = state.effects.length;
          // state.effects.push({ ...message, id: index });
          setTimeout(() => {
            // state.effects = state.effects.filter(e => e.id !== index);
            // this.render();
            destroyBox(id, pos);
            setEffect(id, pos);
          }, 400);
        }
        break;
      }

      case "move-server": {
        setPlayerPosition(message.player.id, message.player.pos);
        break;
      }
      case "waiting": {
        this.gameState.getState().countDown.timer = message.time;
        break;
      }
      case "start-server": {
        this.render();
        break;
      }
      case "gameover-server":
        this.gameState.getState().status = {
          number: 0,
          title: "Game Over",
          message: `the Winner is ${message.winner}`,
        };
        this.render();
        break;
      default:
        console.warn("Unhandled WebSocket message:", message);
        break;
    }
  }

  setup() {
    this.socket.onMessage((data) => this.handleMessage(data));
  }
}
