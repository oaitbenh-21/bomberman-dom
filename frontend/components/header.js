import { createElement } from "../../mini-framework/src/mini-framework-z01.js"

const renderHeader = (gameData = { count: 0, time: "00:00", lifes: 2, bombs: 1, }) => {
  return createElement('header', { class: 'header' },
    [
      createElement('div', { class: 'item' }, [
        `count: ${gameData.count}/4`,
        createElement('img', { src: './assets/img/player.png', alt: "player" })
      ]),
      createElement('div', { class: 'item' }, [
        `Time: ${gameData.time}`,
        createElement('img', { src: './assets/img/timer.png', alt: "timer" })
      ]),
      createElement('div', { class: 'item' }, [
        `Lifes: ${gameData.lifes}`,
        createElement('img', { src: './assets/img/lifes.png', alt: "heart" })
      ]),
      createElement('div', { class: 'item' }, [
        `Bombs: ${gameData.bombs}`,
        createElement('img', { src: './assets/img/bombs.png', alt: "bomb" })
      ])
    ]
  );
};

export default renderHeader;
