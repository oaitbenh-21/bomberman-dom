import {
    createElement,
    createSignal,
    effect
} from "../../mini-framework/src/mini-framework-z01.js";


const boxSignals = {};

/**
 * Initialize players with signals and refs.
 */
export function setBoxes(boxes) {
    boxes.forEach(box => {
        if (!boxSignals[box.id]) {
            boxSignals[box.id] = createSignal({ ...box.pos, distroyed: false });
        }
    });
}
/**
 * destroy the box.
 */
export function destroyBox(id, newPos) {
    const signal = boxSignals[String(id)];
    if (signal) {
        signal.set({ x: newPos.x, y: newPos.y, distroyed: true });
    } else {
        console.warn(`No signal found for box ${id}`);
    }
}
/**
 * Render players with reactive position effects.
 */
const Boxes = () => {
    return createElement(
        "div",
        { class: "box" },
        Object.entries(boxSignals).map(([id, signal]) => {
            return createElement("img", {
                class: "box",
                src: "./assets/img/box.png",
                alt: "box",
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translate(${signal.get().x * 40}px, ${signal.get().y * 40}px)`, // initial render
                },
                id,
                key: id,
                onMount(el) {
                    const stop = effect(() => {
                        const state = signal.get();
                        if (state.distroyed) {
                            el.src = "./assets/img/bombed.gif";
                            el.remove();
                        }
                    });
                    stop();
                }

            });
        })
    );
};

export default Boxes;
