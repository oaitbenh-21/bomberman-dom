import { createElement } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";
import { endGame } from "./endGame.js";

const renderBoard = (
      board = [],
      players = [],
      skills = [],
      status = {},
      bombs = [],
      effects = [],
      isChating
) => {
    bombs = Array.isArray(bombs) ? bombs : [];

    if (!Array.isArray(board))
        return createElement("div", { class: "board" }, "Loading...");
    if (board.length === 0)
        return createElement("div", { class: "board" }, [
            // create loading animation
            createElement("div", { class: "loading" }, [
                "loading...",
                createElement("div", { class: "loading-bar" }),
            ]),
        ]);

      // returned html
      return createElement(
            "div",
            {
                  onclick: () => {
                        console.log("board clicked, chating:", isChating);
                        isChating.setState(false);
                        console.log("did it ischating changed", isChating);
                  },
                  class: "board",
            },
            [
                  ...board.map((row) =>
                        createElement("div", { class: "row" }, [
                              ...row.map((cell) => {
                                    if (cell === 2)
                                          return createElement("div", { class: "wall" });
                                    if (cell === 3)
                                          return createElement("div", { class: "box" });
                                    return createElement("div", { class: "empty" });
                              }),
                        ])
                  ),
                  // render players
                  ...players.map((player) =>
                        createElement("img", {
                              class: "player",
                              src: "./assets/img/down-1.png",
                              style: `left: 0px; top: 0px; transform: translate(${player.pos?.x}px, ${player.pos?.y}px);`,
                              id: player.id,
                        })
                  ),
                  // render image of players
                  ...skills.map((skill) =>
                        createElement("img", {
                              class: "player",
                              src: `./assets/img/${skill.name}.png`,
                              style: `left: 0px; top: 0px; transform: translate(${skill.pos?.x}px, ${skill.pos?.y}px);`,
                              id: skill.id,
                        })
                  ),

                  endGame(status),
                  ...bombs.map((bomb) =>
                        createElement("img", {
                              class: "player",
                              src: `./assets/img/bomb.gif`,
                              style: `left: 0px; top: 0px; transform: translate(${bomb.pos?.x}px, ${bomb.pos?.y}px);`,
                        })
                  ),
                  // create player image at the end
                  ...effects.map((effect) =>
                        createElement("img", {
                              class: "player",
                              src: `./assets/img/bombed.gif`,
                              style: `left: 0px; top: 0px; transform: translate(${effect.pos?.left}px, ${effect.pos?.top}px);`,
                        })
                  ),
            ]
      );
};

export default renderBoard;
