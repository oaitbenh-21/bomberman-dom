import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


function renderWaitingRoom(gameState, container) {
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

      renderCountdown(); // Initial render

      const interval = setInterval(() => {
            const currentPlayers = Object.entries(gameState.getState().players);

            if (currentPlayers.length > 1) {
                  timer--;
                  renderCountdown();

                  if (timer <= 0) {
                        clearInterval(interval);
                  }
            }
      }, 1000);
}


export default renderWaitingRoom;