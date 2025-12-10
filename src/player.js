import { Gameboard } from './gameboard.js';

class Player {
  #type;
  #gameboard;
  constructor(type) {
    if (type != "computer" && type != "human") {
      throw new Error('player must be initialised with either type "human" or type "computer"');
    }
    this.#type = type;
    this.#gameboard = new Gameboard();
  }

  get type() {
    return this.#type;
  }

  get gameboard() {
    return this.#gameboard;
  }
}


export { Player };
