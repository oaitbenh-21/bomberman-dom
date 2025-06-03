import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


function renderWaitingRoom(gameState, container) {
      // 🧹 Clear any existing interval
      let currentInterval = gameState.getState().currentInterval;
      if (currentInterval) {
            console.log('found interval in waiting room:', currentInterval)
            clearInterval(currentInterval);
      }

      let timer = gameState.getState().count;

      const renderCountdown = () => {
            const state = gameState.getState();
            const name = state.name.get();
            const playersObj = state.players;
            const players = Object.entries(playersObj);

            const waiting = createElement("div", { class: "waitingRoom" }, [
                  createElement("h2", {}, `Welcome, ${name}`),
                  createElement("p", {}, [`Waiting for other players ${timer}s...`]),
                  createElement('span', { class: "countDown" }, `players ${players.length}/4`),
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

      renderCountdown(); // initial render

      // ⏱️ Start new interval and store it on the container
      const currentState = gameState.getState();
      gameState.getState().currentInterval = setInterval(() => {
            console.log('im still working ....................................................................')
            const currentPlayers = Object.entries(currentState.players);

            if (currentPlayers.length > 1) {
                  timer--;
                  renderCountdown();

                  if (timer <= 0) {
                        clearInterval(currentInterval);
                        currentInterval = null;
                  }
            }
      }, 1000);
}


export default renderWaitingRoom;