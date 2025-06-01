import {
  createElement,
  createSignal,
  createRef
} from "../../mini-framework/src/mini-framework-z01.js";


/*___________________________________________________________________________*/
class Signal {
  static currentEffect = null;
  constructor(initialValue) {
    this._value = initialValue;
    this.subscribers = new Set();
    this.isSignal = true;
  }

  get() {
    if (Signal.currentEffect) {
      this.subscribers.add(Signal.currentEffect);
    }
    return this._value;
  }

  set(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.subscribers.forEach(fn => fn());
    }
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this.set(newValue);
  }

}

/*___________________________________________________________________________*/

function effect(fn) {
  Signal.currentEffect = fn;
  fn(); // run once to collect dependencies
  Signal.currentEffect = null;
}
// Create a reactive signal
const pos = new Signal({ x: 150, y: 95 }); //{x:0 , y:10}




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

// Update the position (simulate movement)
export function setPlayerPosition(id, newPos) {
  console.log('po po pos:', newPos)
  // const current = pos.get()
  // pos.set({ ...current, ...newPos });
  const value = pos.get();
  pos.set({ x: newPos.x, y: newPos.y })
}
// export function setPlayerPosition(id, post) {
//   // if (!playerSignals[id]) {
//   //   console.warn(`Player ${id} not found in playerSignals.`);
//   //   return;
//   // }
//   // playerSignals[id].set({ ...pos });
//   const value = pos.get();
//   pos.set({ post });
//   console.log('new pos', pos)
// }

/**
 * Render players with reactive position effects.
 */
const Players = () => {
  const setupDone = new Set();

  return createElement(
    "div",
    { class: "Players" },
    Object.entries(playerSignals).map(([id, posSignal]) => {
      if (!playerRefs[id]) {
        playerRefs[id] = { current: null };
      }
      const ref = playerRefs[id];

      // // Setup effect only once per player
      // if (!setupDone.has(id)) {
      //   setupDone.add(id);
      //   effect(() => {
      //     const el = ref.current;
      //     if (el) {
      //       el.style.transform = `translate(${posSignal.get().x}px, ${posSignal.get().y}px)`;
      //     }
      //   });
      // }
      // React to signal changes


      return createElement("img", {
        class: "player",
        src: "./assets/img/down-1.png",
        style: `left: 0px; top: 0px; `,
        alt: "player",
        id,
        key: id,
        onMount(el) {
          console.log("onMount called for", el); // ← Should always print

          // This assumes mini-framework-z01 supports an `onMount` lifecycle hook

          effect(() => {
            const npos = pos.get();
            el.style.transform = `translate(${npos.x}px, ${npos.y}px)`;
            console.log(el.style.transform)
          });
        }
      });
    })
  );
};


export default Players;
