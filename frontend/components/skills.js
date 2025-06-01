import {
  createElement,
  createSignal,
  effect
} from "../../mini-framework/src/mini-framework-z01.js";

const skillSignals = {};

/**
 * Initialize players with signals and refs.
 */
export function setSkills(skills) {
  skills.forEach(skill => {
    if (!skillSignals[skill.id]) {
      skillSignals[skill.id] = createSignal({ ...skill, distroyed: false });
    }
  });
}
/**
 * destroy the box.
 */
export function destroySkill(id) {
  console.log('destroy skill is called:', id)
  const signal = skillSignals[String(id)];
  if (signal) {
    signal.set({ distroyed: true });
  } else {
    console.warn(`No signal found for skill${id}`);
    console.warn('box signal', signal)
    console.warn('all signals:', skillSignals)
  }
}
/**
 * Render players with reactive position effects.
 */
const Skills = () => {
  console.log('now put the skills in placee')
  return createElement(
    "div",
    { class: "skills" },
    Object.entries(skillSignals).map(([id, signal]) => {
      return createElement("img", {
        class: "skill",
        src: `./assets/img/${signal.get().name}`,
        alt: "skill",
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: 30,
          height: 30,
          backgroud: "#ddd",
          transform: `translate(${signal.get().x}px, ${signal.get().y}px)`, // initial render
        },
        id,
        key: id,
        onMount(el) {
          const stop = effect(() => {
            const state = signal.get();
            console.log('signal to remove the skill', state)
            if (state.distroyed) {
              console.log('the brick is going to be removed');
              el.remove();
              stop();
            }
          });
        }
      });
    })
  );
};

export default Skills;
