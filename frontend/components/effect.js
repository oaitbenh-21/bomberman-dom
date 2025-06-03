import {
    createElement,
    createSignal,
    effect,
    appendTo
} from "../../mini-framework/src/mini-framework-z01.js";

const effectSignals = createSignal({});

/**
 * Create a new effect at the specified position
 */
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

/**
 * Remove a specific effect by ID
 */
export function removeEffect(id) {
    const current = { ...effectSignals.get() };
    if (current[id]) {
        delete current[id];
        effectSignals.set(current);
    }
}

/**
 * Clear all effects
 */
export function clearEffects() {
    effectSignals.set({});
}

const Effects = () => {
    return createElement(
        "div",
        {
            class: "effects-container",
            onMount(el) {
                const effectElements = new Map(); // Track DOM elements by effect ID
                const cleanupFunctions = new Map(); // Track cleanup functions

                effect(() => {
                    const effects = effectSignals.get();

                    if (effects && typeof effects === "object") {
                        // Get current effect IDs
                        const currentEffectIds = new Set(Object.keys(effects));

                        // Remove effects that no longer exist in signals
                        for (const [effectId, element] of effectElements.entries()) {
                            if (!currentEffectIds.has(effectId)) {
                                element.remove();
                                effectElements.delete(effectId);

                                // Run cleanup function if it exists
                                const cleanup = cleanupFunctions.get(effectId);
                                if (cleanup) {
                                    cleanup();
                                    cleanupFunctions.delete(effectId);
                                }
                            }
                        }

                        // Add new effects
                        for (const [effectId, effectSignal] of Object.entries(effects)) {
                            const effectData = effectSignal.get();

                            // Skip if already rendered
                            if (effectElements.has(effectId)) {
                                continue;
                            }

                            const img = createElement("img", {
                                class: "effect",
                                src: `./assets/img/bombed.gif`,
                                style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: '30px',
                                    height: "30px",
                                    transform: `translate(${effectData.pos.left}px, ${effectData.pos.top}px)`,
                                },
                                alt: "bombed",
                                id: effectId,
                                onMount(imgEl) {
                                    // Store element reference
                                    effectElements.set(effectId, imgEl);

                                    // Set up position reactivity
                                    const stopPositionEffect = effect(() => {
                                        const currentState = effectSignal.get();
                                        if (imgEl.parentNode) {
                                            imgEl.style.transform = `translate(${currentState.pos.left}px, ${currentState.pos.top}px)`;
                                        }
                                    });

                                    // Auto-remove effect after animation
                                    const removeTimer = setTimeout(() => {
                                        if (imgEl.parentNode) {
                                            imgEl.remove();
                                        }

                                        // Clean up references
                                        effectElements.delete(effectId);
                                        cleanupFunctions.delete(effectId);

                                        // Clean up the signal
                                        const current = { ...effectSignals.get() };
                                        delete current[effectId];
                                        effectSignals.set(current);

                                        stopPositionEffect();
                                    }, 200);

                                    // Store cleanup function
                                    const cleanup = () => {
                                        clearTimeout(removeTimer);
                                        stopPositionEffect();
                                    };
                                    cleanupFunctions.set(effectId, cleanup);

                                    return cleanup;
                                }
                            });

                            appendTo(el, img);
                        }
                    }
                });
            }
        }
    );
};

export default Effects;