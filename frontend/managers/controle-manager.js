// src/control-handler.js
const DirectionMap = {
    "ArrowUp": "t",
    "ArrowDown": "b",
    "ArrowLeft": "l",
    "ArrowRight": "r",
};

export default class ControlHandler {
    constructor(event, isChating, moveCallback, bombCallback, gameState) {
        this.gameState = gameState;
        this.event = event;
        this.isChating = isChating;
        this.moveCallback = moveCallback;
        this.bombCallback = bombCallback;

        this.move = this.move.bind(this);
        this.event.on("keydown", this.move);
        this.event.on("keyup", this.reset);
    }

    move(e) {
        if (this.isChating.getState()) return;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
            this.gameState.addMoveDirection(DirectionMap[e.key]);
        }

        if (e.key === " ") {
            e.preventDefault();
            this.bombCallback();
        }
    }

    reset = (e) => {
        
            e.preventDefault();
            this.gameState.removeMoveDirection(DirectionMap[e.key] ? DirectionMap[e.key] : null);
    };

    destroy() {
        this.event.off("keydown", this.move);
        this.event.off("keyup", this.reset);
    }
}
