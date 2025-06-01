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
      if (ref && ref.current) {
        ref.current.style.transform = `translate(${posSignal.value.x}px, ${posSignal.value.y}px)`;
      }
    });

    return createElement("img", {
      class: "player",
      src: "./assets/img/down-1.png",
      style: `left: 0px; top: 0px; transform: translate(${posSignal.value.x}px, ${posSignal.value.y}px);`,
      alt: "player",
      id,
      key: id,
      ref: el => { ref.current = el; }
    });
  }));
};

export default Players;
