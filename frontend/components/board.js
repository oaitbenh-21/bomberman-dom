import { createElement } from "../../mini-framework/src/mini-framework-z01.js";
import Players, { setPlayers } from "./players.js";
import Boxes, { setBoxes } from "./box.js";
import Skills from "./skills.js";
import Bombs from "./bombs.js"
import Effects from "./effect.js";


const renderBoard = (
      boxes = [],
      players = [],
      isChating,
) => {
      console.log('starting the board: is chatting: , ', isChating)
      let board = [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'w'],
            ['w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w'],
            ['w', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'w'],
            ['w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w'],
            ['w', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'w'],
            ['w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w'],
            ['w', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'w'],
            ['w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w'],
            ['w', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
      ];


      setPlayers(players);
      setBoxes(boxes);

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
                        console.log('set is chatting to false in board but befor:', isChating)
                        
                        isChating.setState(false);
                        console.log('now set chatting is :', isChating)
                  },

                  class: "board",
            },
            [
                  ...board.map((row) =>
                        createElement("div", { class: "row" }, [
                              ...row.map((cell) => {
                                    if (cell === 'w')
                                          return createElement("div", { class: "wall" });
                                    return createElement("div", { class: "empty" });
                              }),
                        ])
                  ),

                  Boxes(),
                  Players(),
                  Skills(),
                  Bombs(),
                  Effects(),

                  // endGame(status),
                  // ...bombs.map((bomb) =>
                  //       createElement("img", {
                  //             class: "player",
                  //             src: `./assets/img/bomb.gif`,
                  //             style: `left: 0px; top: 0px; transform: translate(${bomb.pos?.x}px, ${bomb.pos?.y}px);`,
                  //       })
                  // ),
                  // create player image at the end
                  // ...effects.map((effect) =>
                  //       createElement("img", {
                  //             class: "player",
                  //             src: `./assets/img/bombed.gif`,
                  //             style: `left: 0px; top: 0px; transform: translate(${effect.pos?.left}px, ${effect.pos?.top}px);`,
                  //       })
                  // ),
            ]
      );
};

export default renderBoard;
