import {
  createElement,
  createSignal,
  effect,
  createRef
} from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.22/dist/mini-framework-z01.min.js";

const playerRefs = {};
const playerSignals = {};

export function setPlayers(players) {
  players.forEach(player => {
    if (!playerSignals[player.id]) {
      playerSignals[player.id] = createSignal(player.pos);
      playerRefs[player.id] = createRef();
    }
  });
}

export function setPlayerPosition(id, pos) {
  if (playerSignals[id]) {
    playerSignals[id].value = pos;
  }
}

const Players = () => {
  return createElement("div", { class: "Players" }, Object.entries(playerSignals).map(([id, posSignal]) => {
    const ref = playerRefs[id];

    effect(() => {
      const pos = posSignal.value;
      if (ref && ref.current) {
        ref.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
    });

    return createElement("img", {
      class: "player",
      src: "./assets/img/down-1.png",
      style: "left: 0px; top: 0px;",
      id,
      key: id,
      ref: el => { ref.current = el; }
    });
  }));
};

export default Players;
