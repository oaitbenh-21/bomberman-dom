// src/control-handler.js
export default class ControlHandler {
    constructor(event, isChating, moveCallback, bombCallback) {
        this.event = event;
        this.isChating = isChating;

        this.moveCallback = moveCallback;
        this.bombCallback = bombCallback;

        this.move = this.move.bind(this);
        this.event.on("keydown", this.move);
    }

    move(e) {
        if (this.isChating.getState()) return;
        if (
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
                e.key
            )
        ) {
            e.preventDefault();
        }
        switch (e.key) {
            case "ArrowDown":
                this.moveCallback("b");
                break;
            case "ArrowUp":
                this.moveCallback("t");
                break;
            case "ArrowLeft":
                this.moveCallback("l");
                break;
            case "ArrowRight":
                this.moveCallback("r");
                break;
            case " ":
                this.bombCallback();
                break;
        }
    }

    destroy() {
        this.event.off("keydown", this.move);
    }
}
