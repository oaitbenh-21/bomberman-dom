import { createElement, createSignal } from "../../mini-framework/src/mini-framework-z01.js"
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
            el.textContent = `Players: ${data.count}/4`;
            // el.querySelector('img')?.src = './assets/img/player.png';
            // el.querySelector('img')?.alt = "player";
          });
        }
      }, [
        `count: ${gameData.count}/4`,
        createElement('img', { src: './assets/img/player.png', alt: "player" })
      ]),
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `Time: ${data.time}`;
            // el.querySelector('img')?.src = './assets/img/timer.png';
            // el.querySelector('img')?.alt = "timer";
          });
        }
      }, [
        `Time: ${gameData.time}`,
        createElement('img', { src: './assets/img/timer.png', alt: "timer" })
      ]),
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `Lifes: ${data.lifes}`;
            // el.querySelector('img')?.src = './assets/img/lifes.png';
            // el.querySelector('img')?.alt = "heart";
          });
        }
      }, [
        `Lifes: ${gameData.lifes}`,
        createElement('img', { src: './assets/img/lifes.png', alt: "heart" })
      ]),
      createElement('div', {
        class: 'item',
        onMount(el) {
          effect(() => {
            const data = HeaderSignals.get();
            el.textContent = `Bombs: ${data.bombs}`;
            // el.querySelector('img')?.src = './assets/img/bombs.png';
            // el.querySelector('img')?.alt = "bomb";
          });
        }
      }, [
        `Bombs: ${gameData.bombs}`,
        createElement('img', { src: './assets/img/bombs.png', alt: "bomb" })
      ])
    ]
  );
};

export default renderHeader;
