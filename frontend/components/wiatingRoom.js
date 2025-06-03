import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


function renderWaitingRoom(gameState, container) {
      // 🧹 Clear any existing interval
      if (container._waitingRoomInterval) {
            clearInterval(container._waitingRoomInterval);
      }

      let timer = gameState.getState().count;

      const renderCountdown = () => {
            const state = gameState.getState();
            const name = state.name.get();
            const playersObj = state.players;
            const players = Object.entries(playersObj);

            console.log("the players in the waiting room", players);

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
      const interval = setInterval(() => {
            const currentState = gameState.getState();
            const currentPlayers = Object.entries(currentState.players);

            if (currentPlayers.length > 1) {
                  timer--;
                  renderCountdown();

                  if (timer <= 0) {
                        clearInterval(interval);
                        container._waitingRoomInterval = null;
                  }
            }
      }, 1000);

      // Store reference to the interval so we can clear it later
      container._waitingRoomInterval = interval;
}


export default renderWaitingRoom;