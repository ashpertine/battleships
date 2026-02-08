class Game {
  #internalGameboard
  constructor(gameboard) {
    this.#internalGameboard = gameboard;
  }

  get gameboard() {
    return this.#internalGameboard;
  }
  start() {
    console.log(this.gameboard);
  }
}


export { Game }
