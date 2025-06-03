import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


function endGame(gameState, container) {
      const state = gameState.getState();
      const status = state.status;
      console.log(status)
      const winner = state.winner;
      const endGame = createElement("div", { class: "waitingRoom" }, [
            createElement("h2", {}, [`${status.title}`]),
            createElement("p",{},[`${status.message}`])
      ]);
      render(endGame, container);

}

export default endGame;