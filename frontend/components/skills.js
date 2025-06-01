import {
  createElement,
  createSignal,
  effect
} from "../../mini-framework/src/mini-framework-z01.js";

class SkillsManager {
  constructor() {
    this.skillSignals = {};
    this._rerenderSignal = createSignal(0); // force reactive wrapper
  }

  /**
   * Adds or updates skill signals.
   */
  setSkills(skills) {
    let changed = false;

    // Add or update signals
    skills.forEach(skill => {
      if (!this.skillSignals[skill.id]) {
        this.skillSignals[skill.id] = createSignal({
          name: skill.name,
          x: skill.pos?.x ?? 0,
          y: skill.pos?.y ?? 0,
        });
        changed = true;
      } else {
        const current = this.skillSignals[skill.id].get();
        if (
          current.name !== skill.name ||
          current.x !== skill.pos?.x ||
          current.y !== skill.pos?.y
        ) {
          this.skillSignals[skill.id].set({
            name: skill.name,
            x: skill.pos?.x ?? 0,
            y: skill.pos?.y ?? 0,
          });
        }
      }
    });

    // Remove unused signals
    const currentIds = skills.map(skill => skill.id);
    Object.keys(this.skillSignals).forEach(id => {
      if (!currentIds.includes(id)) {
        delete this.skillSignals[id];
        changed = true;
      }
    });

    if (changed) {
      this._rerenderSignal.set(this._rerenderSignal.get() + 1); // trigger re-render
    }
  }

  /**
   * Removes a skill by ID.
   */
  removeSkill(id) {
    if (this.skillSignals[id]) {
      delete this.skillSignals[id];
      this._rerenderSignal.set(this._rerenderSignal.get() + 1);
    }
  }

  /**
   * Component that renders all skills reactively.
   */
  render() {
    return createElement("div", {}, this.reactiveList());
  }

  /**
   * Reactive list wrapper.
   */
  reactiveList() {
    return createElement("div", {
      onMount: (container) => {
        effect(() => {
          // clear old content
          container.innerHTML = "";

          // append each skill element
          Object.entries(this.skillSignals).forEach(([id, signal]) => {
            const skill = signal.get();
            const el = createElement("img", {
              class: `skill ${skill.name}`,
              src: `./assets/img/${skill.name}.png`,
              style: {
                position: "absolute",
                width: "30px",
                height: "30px",
                left: "0px",
                top: "0px",
                transform: `translate(${skill.x}px, ${skill.y}px)`,
                transition: "transform 0.15s ease"
              },
              alt: "skill",
              id,
              key: id,
              onMount(el) {
                effect(() => {
                  const { x, y } = signal.get();
                  el.style.transform = `translate(${x}px, ${y}px)`;
                  el.style.display = "block";
                });
              }
            });

            container.appendChild(el);
          });

          // track change
          this._rerenderSignal.get();
        });
      }
    });
  }
}

// Singleton export
export const SkillsInstance = new SkillsManager();
export const setSkills = (skills) => SkillsInstance.setSkills(skills);
export const removeSkill = (id) => SkillsInstance.removeSkill(id);
export default () => SkillsInstance.render();
