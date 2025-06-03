import {
    createElement,
    createSignal,
    effect,
    appendTo
} from "../../mini-framework/src/mini-framework-z01.js";


const bombsSignals = createSignal({});

/**
 * Initialize players with signals and refs.
 */
export function setBombs(bombs) {
    const currentMap = { ...bombsSignals.get() }; // clone to trigger signal
    let updated = false;

    // bombs.forEach(bomb => {
    if (!currentMap[bombs.id]) {
        currentMap[bombs.id] = createSignal({ ...bombs, destroyed: false });
        updated = true;
    }
    // });

    if (updated) {
        bombsSignals.set(currentMap); // now effects depending on this will re-run
    }
}


/**
 * destroy the box.
 */
export function destroyBombs(id) {
    const signal = bombsSignals.get()[id];
    if (signal) {
        signal.set({ ...signal.get(), destroyed: true });
    } else {
        console.warn(`No signal found for skill ${id}`);
    }
}

/**
 * Render bombs with reactive position effects.
 */

const Bombs = () => {
    return createElement(
        "div",
        {
            class: "bomb", onMount(el) {
                effect(() => {
                    const bombs = bombsSignals.get(); // initial render (not reactive here)

                    if (bombs && typeof bombs === "object") {
                        for (const [key, value] of Object.entries(bombs)) {
                            let signal = value._value;
                            let id = signal.id

                            const img = createElement("img", {
                                class: "bomb",
                                src: `./assets/img/bomb.gif`,
                                style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: '30px',
                                    height: "30px",
                                    transform: `translate(${signal.pos.x}px, ${signal.pos.y}px)`, // initial render
                                },
                                alt: "bomb",
                                id,
                                key: id,
                                onMount(el) {
                                    const stop = effect(() => {
                                        const state = value.get();

                                        setTimeout(() => {
                                            // Show explosion
                                            // el.src = `./assets/img/bombed.gif`;
                                            // Optional delay to show explosion image
                                            el.remove(); // Remove from DOM

                                            // Clean up the signal
                                            const current = { ...bombsSignals.get() };
                                            delete current[state.id]; // Remove from signals map
                                            bombsSignals.set(current); // Trigger reactivity
                                        }, 2000);
                                    });
                                    stop(); // Stop reactivity
                                }

                            });
                            appendTo(el, img)

                        }
                    }

                })
            }
        },
    );
};

export default Bombs;
