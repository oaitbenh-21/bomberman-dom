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
    const currentMap = { ...bombsSignals.get() };
    let updated = false;

    if (!currentMap[bombs.id]) {
        currentMap[bombs.id] = createSignal({ ...bombs, destroyed: false });
        updated = true;
    }

    if (updated) {
        bombsSignals.set(currentMap);
    }
}

/**
 * destroy the bomb.
 */
export function destroyBombs(id) {
    const signal = bombsSignals.get()[id];
    if (signal) {
        signal.set({ ...signal.get(), destroyed: true });
    } else {
        console.warn(`No signal found for bomb ${id}`);
    }
}

/**
 * Render bombs with reactive position effects.
 */
const Bombs = () => {
    return createElement(
        "div",
        {
            class: "bomb-container",
            onMount(el) {
                const bombElements = new Map(); // Track DOM elements by bomb ID
                const cleanupFunctions = new Map(); // Track cleanup functions
                
                effect(() => {
                    const bombs = bombsSignals.get();

                    if (bombs && typeof bombs === "object") {
                        // Get current bomb IDs
                        const currentBombIds = new Set(Object.keys(bombs));
                        
                        // Remove bombs that no longer exist in signals
                        for (const [bombId, element] of bombElements.entries()) {
                            if (!currentBombIds.has(bombId)) {
                                element.remove();
                                bombElements.delete(bombId);
                                
                                // Run cleanup function if it exists
                                const cleanup = cleanupFunctions.get(bombId);
                                if (cleanup) {
                                    cleanup();
                                    cleanupFunctions.delete(bombId);
                                }
                            }
                        }

                        // Add new bombs
                        for (const [bombId, bombSignal] of Object.entries(bombs)) {
                            const bombData = bombSignal.get();
                            
                            // Skip if already rendered or destroyed
                            if (bombElements.has(bombId) || bombData.destroyed) {
                                continue;
                            }

                            const img = createElement("img", {
                                class: "bomb",
                                src: `./assets/img/bomb.gif`,
                                style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: '30px',
                                    height: "30px",
                                    transform: `translate(${bombData.pos.x}px, ${bombData.pos.y}px)`,
                                },
                                alt: "bomb",
                                id: bombData.id,
                                onMount(imgEl) {
                                    // Store element reference
                                    bombElements.set(bombId, imgEl);
                                    
                                    // Set up position reactivity
                                    const stopPositionEffect = effect(() => {
                                        const currentState = bombSignal.get();
                                        if (!currentState.destroyed && imgEl.parentNode) {
                                            imgEl.style.transform = `translate(${currentState.pos.x}px, ${currentState.pos.y}px)`;
                                        }
                                    });

                                    // Set up explosion timer
                                    const explosionTimer = setTimeout(() => {
                                        if (imgEl.parentNode) {
                                            imgEl.remove();
                                        }
                                        
                                        // Clean up references
                                        bombElements.delete(bombId);
                                        cleanupFunctions.delete(bombId);
                                        
                                        // Clean up the signal
                                        const current = { ...bombsSignals.get() };
                                        delete current[bombId];
                                        bombsSignals.set(current);
                                        
                                        stopPositionEffect();
                                    }, 2000);

                                    // Store cleanup function
                                    const cleanup = () => {
                                        clearTimeout(explosionTimer);
                                        stopPositionEffect();
                                    };
                                    cleanupFunctions.set(bombId, cleanup);
                                    
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

export default Bombs;