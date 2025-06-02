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
    console.log('not what:', bombs)
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
 * Initialize players with signals and refs.
 */
// export function setBombs(bombs) {
//     console.log('bomb apeared')
//     const currentMap = { ...bombsSignals.get() }; // clone to trigger signal
//     console.log('current map:', currentMap)
//     let updated = false;
//     if (bombs && typeof bombs === "object") {
//         bombs.forEach(bomb => {
//             if (!currentMap[bomb.id]) {
//                 console.log('looping on skills:', bomb)
//                 currentMap[bomb.id] = createSignal({ ...bomb, destroyed: false });
//                 updated = true;
//             }
//         });
//     }

//     if (updated) {
//         console.log('setting the bomb')
//         bombsSignals.set(currentMap); // now effects depending on this will re-run
//     }
// }

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
 * Render players with reactive position effects.
 */


const Bombs = () => {
    return createElement(
        "div",
        {
            class: "bomb", onMount(el) {
                effect(() => {
                    const bombs = bombsSignals.get(); // initial render (not reactive here)

                    console.log('render the bomb to the UI', bombs)

                    if (bombs && typeof bombs === "object") {
                        for (const [key, value] of Object.entries(bombs)) {
                            let signal = value._value;
                            let id = signal.id
                            console.log('signal bomb', signal);


                            const img = createElement("img", {
                                class: "bomb",
                                src: `./assets/img/boom.gif`,
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
                                            el.remove();
                                            stop();
                                        }, 2000)
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



export default Bombs;
