import { cloneElement } from "react";
import { createElement,createSignal } from "../../mini-framework/src/mini-framework-z01";

class WaitingRoom {
    constructor() {
        this.Players = [];
        this.maxPlayers = 4; // Maximum players allowed in a game
    }

    setPlayer(player) {
        // Check if room is full
        if (this.Players.length >= this.maxPlayers) {
            throw new Error('Room is full');
        }

        // Add player if they don't already exist
        if (!this.Players.includes(player)) {
            this.Players.push(player);
            return true;
        }
        return false;
    }

    removePlayer(player) {
        const index = this.Players.indexOf(player);
        if (index > -1) {
            this.Players.splice(index, 1);
            return true;
        }
        return false;
    }

    isRoomFull() {
        return this.Players.length >= this.maxPlayers;
    }

    getPlayerCount() {
        return this.Players.length;
    }

    getAllPlayers() {
        return [...this.Players];
    }
    Rooom(){
      return createElement(
            'div',{
                  class:"waitingRoom"
            },
            [
                  createElement('h3',{class:"inro"}),
                  createElement('div',{class:'roomContainer'},[
                        createElement('span',{
                              class:""
                        })
                  ])
            ]
      )
    }
    
}