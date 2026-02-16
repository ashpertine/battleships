import { Computer } from "../computer.js";

class Game {
  #playerGameboard;
  #computerGameboard;
  constructor(player_gameboard) {
    this.#playerGameboard = player_gameboard;
    const com = new Computer();
    com.populateGameboard();
    this.#computerGameboard = com.gameboard;

    this.mainContainer = document.querySelector("#main-container");
    this.playerGrid = document.createElement("div");
    this.comGrid = document.createElement("div");
    this.playerGrid.classList.add("grid", "player-grid");
    this.comGrid.classList.add("grid", "com-grid");
  }

  #createGrids() {
    const grids = document.querySelectorAll(".grid");
    for (const grid of grids) {
      for (let row = 0; row < 10; row++) {
        for (let column = 0; column < 10; column++) {
          const cell = document.createElement("div");
          cell.classList.add("grid-cell");
          cell.setAttribute("data-row-index", `${row}`);
          cell.setAttribute("data-column-index", `${column}`);
          grid.appendChild(cell);
        }
      }
    }
  }

  start() {}
}

export { Game };
