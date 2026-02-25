import { Computer } from "../computer.js";
import { SHIP_LIST } from "../helpers.js";

class Game {
  #playerGameboard;
  #computerGameboard;
  constructor(player_gameboard) {
    this.#playerGameboard = player_gameboard;
    const com = new Computer();
    com.populateGameboard();
    this.#computerGameboard = com.gameboard;

    this.mainContainer = document.querySelector("#main-container");
  }

  #createGrids() {
    this.playerGrid = document.createElement("div");
    this.comGrid = document.createElement("div");
    this.playerGrid.classList.add("grid", "player-grid");
    this.comGrid.classList.add("grid", "com-grid");

    this.mainContainer.append(this.playerGrid, this.comGrid);
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

  #populateGrid(grid_dom_object, gameboard_object) {
    const addColor = (
      orientation_constant,
      start_index,
      end_index,
      shipColor,
    ) => {
      for (let i = start_index; i <= end_index; i++) {
        if (orientation_constant.ori == "h") {
          const gridCell = grid_dom_object.querySelector(
            `[data-row-index="${orientation_constant.constant}"][data-column-index="${i}"]`,
          );
          gridCell.classList.add(shipColor);
        }

        if (orientation_constant.ori == "v") {
          const gridCell = grid_dom_object.querySelector(
            `[data-row-index="${i}"][data-column-index="${orientation_constant.constant}"]`,
          );
          gridCell.classList.add(shipColor);
        }
      }
    };

    gameboard_object.board.ships.forEach((ship) => {
      const shipId = ship.id;
      const startCoords = ship.coords.start;
      const endCoords = ship.coords.end;
      const shipColor = SHIP_LIST[shipId - 1].color;

      // vertical - x coords are the same
      if (startCoords[0] == endCoords[0]) {
        const orientation_constant = { ori: "v", constant: startCoords[0] };
        if (startCoords[1] > endCoords[1]) {
          addColor(
            orientation_constant,
            endCoords[1],
            startCoords[1],
            shipColor,
          );
        } else {
          addColor(
            orientation_constant,
            startCoords[1],
            endCoords[1],
            shipColor,
          );
        }
      }
      // horizontal - y coords are the same
      else if (startCoords[1] == endCoords[1]) {
        const orientation_constant = { ori: "h", constant: startCoords[1] };
        if (startCoords[0] > endCoords[0]) {
          addColor(
            orientation_constant,
            endCoords[0],
            startCoords[0],
            shipColor,
          );
        } else {
          addColor(
            orientation_constant,
            startCoords[0],
            endCoords[0],
            shipColor,
          );
        }
      }
    });
  }

  start() {
    this.#createGrids();
    this.#populateGrid(this.playerGrid, this.#playerGameboard);
    this.#populateGrid(this.comGrid, this.#computerGameboard);
  }
}

export { Game };
