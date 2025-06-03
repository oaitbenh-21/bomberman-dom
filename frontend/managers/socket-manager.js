import { setBombs } from "../components/bombs.js";
import { destroyBox, setBoxes } from "../components/box.js";
import { setEffect } from "../components/effect.js";
import { setPlayers, setPlayerPosition, destroyPlayer } from "../components/players.js";
import { destroySkill, setSkills } from "../components/skills.js";
import { setMessages } from "../components/chat.js";
import { setHeaderData } from "../components/header.js";
import { compareDatesAndFormat } from "../src/utils.js";



export default class SocketHandler {
  constructor(socket, gameState, board, welcom, waitingList, countDown) {
    this.socket = socket;
    this.gameState = gameState;
    this.board = board;
    this.welcom = welcom;
    this.waitingList = waitingList;
    this.countDown = countDown;
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
        // const state = this.gameState.getState();
        // const players = Object.entries(state.players)
        this.board()
        break;
      }
      case "join-server": {
        console.log('setting the player pos:', message)
        const state = this.gameState.getState();
        state.players = [...state.players, message];
        const currentPlayers = state.gamers.get();
        state.gamers.set([...currentPlayers, message]);
        setPlayers(state.players);
        setPlayerPosition(message.id, message.pos)
        this.waitingList();
        break;
      }

      case "kill-server": {
        const state = this.gameState.getState();
        state.players = state.players.filter(p => p.id !== message.id);
        state.skills = state.skills.filter(s => s.id !== message.id);
        state.effect = message.pos;
        console.log("kill-server message:", message);
        destroySkill(message.id);
        destroyPlayer(message.id);
        break;
      }

      case "skill-server":
        this.gameState.getState().skills.push(message);
        console.log(this.gameState.getState().skills)
        setSkills(this.gameState.getState().skills);
        break;

      case "bomb-server": {
        this.gameState.addBomb({ ...message });
        setBombs(message);
        break;
      }

      case "remove-server": {
        let id = null;
        let pos = null;

        if (message?.remove?.id && message?.effect.pos) {
          id = message.remove.id
          pos = message.effect.pos
        }
        if (id && pos) {
          setTimeout(() => {
            destroyBox(id, pos);
            setEffect(id, pos);
          }, 400);
        }
        break;
      }
      case "countDown": {
        this.gameState.getState().count = message.count
      }

      case "move-server": {
        setPlayerPosition(...message.player);
        break;
      }
      case "waiting": {
        this.gameState.getState().countDown.timer = message.time;
        console.log(message.time)
        this.countDown()
        break;
      }
      case "gameover-server":
        this.gameState.getState().status = {
          number: 0,
          title: "Game Over",
          message: `the Winner is ${message.winner}`,
        };
        // this.render();
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
