import {
  createElement,
  createSignal,
  effect,
  appendTo
} from "../../mini-framework/src/mini-framework-z01.js";


const skillSignals = createSignal({});



/**
 * Initialize players with signals and refs.
 */
export function setSkills(skills) {
  console.log('skill bro:', skills)
  const currentMap = { ...skillSignals.get() }; // clone to trigger signal
  let updated = false;

  skills.forEach(skill => {
    if (!currentMap[skill.id]) {
      currentMap[skill.id] = createSignal({ ...skill, destroyed: false });
      updated = true;
    }
  });

  if (updated) {
    skillSignals.set(currentMap); // now effects depending on this will re-run
  }
}

/**
 * destroy the box.
 */
export function destroySkill(id) {
  const signal = skillSignals.get()[id];
  if (signal) {
    signal.set({ ...signal.get(), destroyed: true });
  } else {
    console.warn(`No signal found for skill ${id}`);
  }
}

/**
 * Render players with reactive position effects.
 */


const Skills = () => {
  return createElement(
    "div",
    {
      class: "skills", onMount(el) {
        effect(() => {
          const skills = skillSignals.get(); // initial render (not reactive here)


          if (skills && typeof skills === "object") {
            for (const [key, value] of Object.entries(skills)) {
              let signal = value._value;
              let id = signal.id
              console.log('signal', signal);


              const img = createElement("img", {
                class: "skill",
                src: `./assets/img/${signal.name}.png`,
                style: {
                  position: "absolute",
                  transform: `translate(${signal.pos.x}px, ${signal.pos.y}px)`, // initial render
                },
                alt: "skill",
                id,
                key: id,
                onMount(el) {
                  const stop = effect(() => {
                    const state = value.get();
                    console.log(state)
                    if (state.destroyed) {
                      console.log('should be distroyed')
                      el.remove();
                      stop();
                    }
                  });
                }
              });
              setTimeout(() => {
                appendTo(el, img)
              }, 500)

            }
          }

        })
      }
    },
  );
};



export default Skills;
