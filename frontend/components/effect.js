import {
    createElement,
    createSignal,
    effect,
    appendTo
} from "../../mini-framework/src/mini-framework-z01.js";

const effectSignals = createSignal({})

export function setEffect(id, pos) {
    console.log('not what effect:', id, pos)

    const currentMap = { ...effectSignals.get() }; // clone to trigger signal
    let updated = false;

    // effects.forEach(effect => {
    if (!currentMap[id]) {
        currentMap[id] = createSignal({ id, pos });
        updated = true;
    }
    // });

    if (updated) {
        effectSignals.set(currentMap); // now effects depending on this will re-run
    }
}

const Effects = () => {
    console.log('render the effects')
    return createElement(
        "div",
        {
            class: "effect", onMount(el) {
                effect(() => {
                    const effects = effectSignals.get(); // initial render (not reactive here)

                    console.log('render the effects to the UI', effects)

                    if (effects && typeof effects === "object") {
                        for (const [key, value] of Object.entries(effects)) {
                            const id = key

                            const img = createElement("img", {
                                class: "effect",
                                src: `./assets/img/bombed.gif`,
                                style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: '30px',
                                    height: "30px",
                                    transform: `translate(${value.get().pos.left}px, ${value.get().pos.top}px)`,
                                },
                                alt: "bombed",
                                id,
                                key: key,
                                onMount(el) {
                                    const stop = effect(() => {
                                        const state = value.get();

                                        // Optional delay to show explosion image
                                        setTimeout(() => {
                                            el.remove(); // Remove from DOM

                                            // Clean up the signal
                                            const current = { ...effectSignals.get() };
                                            delete current[state.id]; // Remove from signals map
                                            effectSignals.set(current); // Trigger reactivity

                                            stop(); // Stop reactivity
                                        }, 200); // Adjust if needed to control explosion duration
                                    });
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


export default Effects;