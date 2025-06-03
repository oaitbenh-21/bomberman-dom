import { createElement, render, } from "../../mini-framework/src/mini-framework-z01.js";


function endGame(gameState, container) {
      const state = gameState.getState();
      const name = state.name.get();
      const winner = state.winner;
      const endGame = createElement("div", { class: "waitingRoom" }, [
            createElement("h2", {}, [`Game over the winner is ${winner}`])
      ]);
      render(endGame, container);

}

export default endGame;