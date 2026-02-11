import { Computer } from "../computer.js";

class Game {
  #playerGameboard;
  #computerGameboard;
  constructor(player_gameboard) {
    this.#playerGameboard = player_gameboard;
    const com = new Computer;
    com.populateGameboard();
    this.#computerGameboard = com.gameboard;
  }

  start() {
    console.log(this.#computerGameboard);
    console.log(this.#playerGameboard);
  }
}


export { Game }
