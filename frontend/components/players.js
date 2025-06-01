import {
  createElement,
  createSignal,
  effect,
  createRef
} from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.22/dist/mini-framework-z01.min.js";

const playerRefs = {};
const playerSignals = {};

/**
 * Initialize players with signals and refs.
 */
export function setPlayers(players) {
  players.forEach(player => {
    if (!playerSignals[player.id]) {
      playerSignals[player.id] = createSignal({ ...player.pos });
      playerRefs[player.id] = createRef();
    }
  });
}

/**
 * Update a player's position reactively.
 */
export function setPlayerPosition(id, pos) {
  if (!playerSignals[id]) {
    console.warn(`Player ${id} not found in playerSignals.`);
    return;
  }
  playerSignals[id].set({ ...pos });
}

/**
 * Render players with reactive position effects.
 */
const Players = () => {
  return createElement(
    "div",
    { class: "Players" },
    Object.entries(playerSignals).map(([id, posSignal]) => {
      const ref = playerRefs[id];

      // Reactive effect that updates the DOM element's transform
      effect(() => {
        const pos = posSignal.value;
        const el = ref.current;
        if (el) {
          el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }
      });

      const initial = posSignal.value;

      return createElement("img", {
        class: "player",
        src: "./assets/img/down-1.png",
        style: `left: 0px; top: 0px; transform: translate(${initial.x}px, ${initial.y}px);`,
        alt: "player",
        id,
        key: id,
        ref: el => {
          ref.current = el;
        }
      });
    })
  );
};

export default Players;
