import { createElement,render,} from "../../mini-framework/src/mini-framework-z01.js";


function renderWaitingRoom(gameState,container) {
      const state = gameState.getState();
            const name = state.name.get();
            const players = Object.entries(state.gamers.get());
            // const timer = state.countDown.get ? state.countDown.get() : state.countDown.timer
            // const countDown 
      const waiting= createElement("div", { class: "waitingRoom" }, [
            createElement("h2", {}, `Welcome, ${name}`),
            createElement("p", {}, "Waiting for other players..."),
            createElement('span',{class:"countDown"},`players${players.length}/4`),
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