import {
  createElement,
  createSignal,
  effect
} from "../../mini-framework/src/mini-framework-z01.js";

const playerSignals = {};

/**
 * Initialize players with signals and refs.
 */
export function setPlayers(players) {
  players.forEach(player => {
    if (!playerSignals[player.id]) {
      playerSignals[player.id] = createSignal({ ...player.pos });
    }
  });
}

export function destroyPlayer(id) {
  const signal = playerSignals[id].get();
  if (signal) {
    playerSignals[id].set({ ...signal, destroyed: true });
  }
}

/**
 * Update the position of a specific player.
 */
export function setPlayerPosition(id, newPos) {
  const signal = playerSignals[id];
  console.log('set player position the subscriped things:', signal.subscribers)
  if (signal) {
    signal.set({ x: newPos.x, y: newPos.y });
  } else {
    console.warn(`No signal found for player ${id}`);
  }
}

/**
 * Render players with reactive position effects.
 */
const Players = () => {
  return createElement(
    "div",
    { class: "Players" },
    Object.entries(playerSignals).map(([id, signal]) => {
      return createElement("img", {
        class: "player",
        src: "./assets/img/down-1.png",
        style: {
          position: "absolute",
          transform: `translate(${1 * 40}px, ${1 * 40}px)`, // initial render
        },
        alt: "player",
        id,
        key: id,
        onMount(el) {
          effect(() => {
            const player = signal.get();
            console.log(player);
            el.style.transform = `translate(${player.x}px, ${player.y}px)`;
            if (player.destroyed && el) {
              el.remove();
            }
          });
        }
      });
    })
  );
};

export default Players;
