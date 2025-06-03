import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


let timer = null;

function renderWaitingRoom(gameState, container) {
      // Clear existing interval
      let currentInterval = gameState.getState().currentInterval;
      if (currentInterval) {
            console.log('found interval in waiting room:', currentInterval);
            clearInterval(currentInterval);
      }


      if (!timer) {
            timer = gameState.getState().count
      }


      // Renders countdown with latest timer value
      const renderCountdown = () => {
            const state = gameState.getState();
            const name = state.name.get();
            const playersObj = state.players;
            const players = Object.entries(playersObj);

            const waiting = createElement("div", { class: "waitingRoom" }, [
                  createElement("h2", {}, `Welcome, ${name}`),
                  createElement("p", {}, [`Waiting for other players ${timer}s...`]),  // use latest timer here
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

      // Start new interval and store it
      const newInterval = setInterval(() => {
            const currentPlayers = Object.entries(gameState.getState().players);

            if (currentPlayers.length > 1) {
                  timer--;
                  renderCountdown();

                  if (timer <= 0) {
                        clearInterval(newInterval);
                        gameState.getState().currentInterval = null;
                  }
            }
      }, 1000);

      // Save new interval ID in state
      gameState.getState().currentInterval = newInterval;
}



export default renderWaitingRoom;