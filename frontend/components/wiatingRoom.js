import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


function renderWaitingRoom(gameState, container) {
      const state = gameState.getState();
      const name = state.name.get();
      const players = Object.entries(state.gamers.get());
      console.log(players)
      let timer = state.count
      const renderCountdown = () => {
            const waiting = createElement("div", { class: "waitingRoom" }, [
                  createElement("h2", {}, `Welcome, ${name}`),
                  createElement("p", {}, [`Waiting for other players ${timer}s...`]),
                  createElement('span', { class: "countDown" }, `players${players.length}/4`),
                  createElement(
                        "ul",
                        { class: "listOfPlayers" },
                        players.map(([_, player], index) =>
                              createElement("li", {}, [`${index + 1}. ${player.name}`])
                        )
                  )
            ]);
            render(waiting, container);
      };
      renderCountdown();
      const interval = setInterval(() => {
            if (players.length > 1) {
                  timer--;
                  renderCountdown();
                  if (timer <= 0) {
                        clearInterval(interval);
                  }
            }
      }, 1000);
}

export default renderWaitingRoom;