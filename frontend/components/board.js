import { createElement } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";

const renderBoard = (board = [], players = [], skills = []) => {
      if (!Array.isArray(board)) return createElement('div', { class: 'board' }, "Loading...");
      if (board.length === 0) return createElement('div', { class: 'board' }, [
            // create loading animation
            createElement('div', { class: 'loading' }, ["loading...",
                  createElement('div', { class: 'loading-bar' }),
            ]
            ),
      ]);
      return createElement('div', { class: 'board' },
            [...board.map(row =>
                  createElement('div', { class: 'row' },
                        [...row.map(cell => {
                              if (cell === 2) return createElement('div', { class: 'wall' });
                              if (cell === 3) return createElement('div', { class: 'box' });
                              return createElement('div', { class: 'empty' });
                        })]
                  )
            ),
            ...players.map(player => createElement('img',
                  { class: 'player', src: "./assets/img/down-1.png", style: `left: 0px; top: 0px; transform: translate(${player.pos?.x}px, ${player.pos?.y}px);`, id: player.id })),
            ...skills.map(skill => createElement('img',
                  { class: 'player', src: `../img/${skill.name}.png`, style: `left: 0px; top: 0px; transform: translate(${skill.pos?.x}px, ${skill.pos?.y}px);`, id: skill.id })),
            ]);
};



export default renderBoard;