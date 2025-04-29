import { v4 as uuidv4 } from 'uuid';


class Game {
    constructor() {
        this.Board = [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]]
        this.Players = new Map()
    }
    addPlayer(player) {
        this.Players[player.id] = player
    }
}
class Player {
    constructor(name, game = new Game()) {
        let myuuid = uuidv4();
        var pos = {}
        switch (game.Players.length) {
            case 0:
                pos.x = 1
                pos.y = 1
                break;
            case 1:
                pos.x = 11
                pos.y = 1
                break;
            case 2:
                pos.x = 1
                pos.y = 10
                break;
            case 3:
                pos.x = 11
                pos.y = 10
                break;

            default:
                this.Remove()
                break;
        }
        this.data = {
            id: myuuid,
            name: name,
            pos: pos,
        }
        game.addPlayer(this.data);
        this.game = game;
    }
    Remove() {
        this = undefined;
    }
    Left() {
        this.data.pos.x--
        if (this.game.Board[y][x] != 0) {
            this.data.pos.x++
        }
    }
    Right() {
        this.data.pos.x++
        if (this.game.Board[y][x] != 0) {
            this.data.pos.x--
        }
    }
    Top() {
        this.data.pos.y--
        if (this.game.Board[y][x] != 0) {
            this.data.pos.y++
        }
    }
    Bottom() {
        this.data.pos.y++
        if (this.game.Board[y][x] != 0) {
            this.data.pos.y--
        }
    }
}