import { createElement,render, state} from "../../mini-framework/src/mini-framework-z01.js";


function renderWaitingRoom(gameState,container) {
      const state = gameState.getState();
            const name = state.name.get();
            const players = Object.entries(state.gamers.get());
            console.log("players", players, name)
      const waiting= createElement("div", { class: "waitingRoom" }, [
            createElement("h2", {}, `Welcome, ${name}`),
            createElement("p", {}, "Waiting for other players..."),
            createElement(
                  "ul",
                  { class: "listOfPlayers" },
                  players.map(([id, player], index) =>
                        createElement("li", {}, [`${index + 1}. ${player.name}`])
                  )
            )
      ]);
      render(waiting,container)
}

export default renderWaitingRoom;