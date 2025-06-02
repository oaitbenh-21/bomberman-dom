import { appendTo, createElement, createSignal } from "../../mini-framework/src/mini-framework-z01.js"
import { effect } from "../../mini-framework/src/mini-framework-z01.js";

let HeaderSignals = createSignal({ count: 0, time: "00:00", lifes: 0, bombs: 0, });

export const setHeaderData = (data) => {
  HeaderSignals.set(data);
}

const renderHeader = (gameData) => {
  return createElement('header', { class: 'header' },
    [
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `${data.count}/4`;
            appendTo(el, createElement('img', { src: './assets/img/player.png', alt: "player" }));
          });
        }
      }, [
        `${gameData.count}/4`,
        createElement('img', { src: './assets/img/player.png', alt: "player" })
      ]),
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `${data.time}`;
            appendTo(el, createElement('img', { src: './assets/img/timer.png', alt: "timer" }));
          });
        }
      }, [
        `${gameData.time}`,
      ]),
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `${data.lifes}`;
            appendTo(el, createElement('img', { src: './assets/img/lifes.png', alt: "lifes" }));
          });
        }
      }, [
        `${gameData.lifes}`,
      ]),
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `${data.bombs}`;
            appendTo(el, createElement('img', { src: './assets/img/bombs.png', alt: "bomb" }));
          });
        }
      }, [
        `${gameData.bombs}`,
      ])
    ]
  );
};

export default renderHeader;
