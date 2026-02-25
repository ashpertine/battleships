import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { SHIP_LIST } from "./helpers.js";

class Computer {
  #computerGameboard;
  constructor() {
    this.#computerGameboard = new Gameboard();
    this.SHIPS = [...SHIP_LIST];
  }

  get gameboard() {
    return this.#computerGameboard;
  }

  #generateRandomCoord() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }

  #pickOrientation() {
    const orientations = ["v", "h"];
    return orientations[Math.round(Math.random())];
  }

  populateGameboard() {
    for (const ship of this.SHIPS) {
      let length = ship.length;
      let coord = this.#generateRandomCoord();
      let orientation = this.#pickOrientation();
      let placed = false;
      const newShip = new Ship(length);
      while (!placed) {
        try {
          this.#computerGameboard.placeShip(newShip, coord, orientation);
          placed = true;
        } catch (error) {
          coord = this.#generateRandomCoord();
          orientation = this.#pickOrientation();
        }
      }
    }
  }
}

export { Computer };
