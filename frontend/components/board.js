import { createElement } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";

const renderBoard = (board = [], players = []) => {
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
            ...players.map(player => createElement('div', { class: 'player', style: `left: 0px; top: 0px; transform: translate(${player.pos?.x}px, ${player.pos?.y}px);`, id: player.id }))]);
};



export default renderBoard;