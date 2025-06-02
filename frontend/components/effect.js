import {
    createElement,
    createSignal,
    effect,
    appendTo
} from "../../mini-framework/src/mini-framework-z01.js";

const effectSignals = createSignal({})

export function setEffect(id, pos) {

    const currentMap = { ...effectSignals.get() }; // clone to trigger signal
    let updated = false;

    if (!currentMap[id]) {
        currentMap[id] = createSignal({ id, pos });
        updated = true;
    }

    if (updated) {
        effectSignals.set(currentMap); // now effects depending on this will re-run
    }
}

const Effects = () => {
    return createElement(
        "div",
        {
            class: "effect", onMount(el) {
                effect(() => {
                    const effects = effectSignals.get(); // initial render (not reactive here)

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

                                        setTimeout(() => {
                                            el.remove();

                                            const current = { ...effectSignals.get() };
                                            delete current[state.id];
                                            effectSignals.set(current);

                                            stop();
                                        }, 200);
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