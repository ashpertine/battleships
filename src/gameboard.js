class Gameboard {
  #grid;
  #boardObj;
  constructor() {
    this.#grid = [...Array(10)].map(e => Array(10).fill('e'));
    this.#boardObj = {
      ships: []
    };
  }

  get board() {
    return this.#boardObj;
  }

  get grid() {
    return this.#grid;
  }

  validateOutOfBounds(coordinates) {
    if ((coordinates[0] < 0 || coordinates[1] < 0) ||
      (!this.#grid[coordinates[0]]) ||
      (!this.#grid[coordinates[0]][coordinates[1]])) {
      return false;
    }

    return true
  }

  findEndCoord(ship_length, starting_coord, orientation) {
    const noOfSpaces = ship_length - 1; // ship already occupies the first grid space on the board   

    let endCoord = []
    if (orientation == 'v') {
      let endPoint = starting_coord[1] + noOfSpaces;
      endCoord = [starting_coord[0], endPoint];
    } else if (orientation == 'h') {
      let endPoint = starting_coord[0] + noOfSpaces;
      endCoord = [endPoint, starting_coord[1]];
    }

    return endCoord
  }

  isOverlapping(shipCoord) {
    for (let row_index = 0; row_index < this.#grid.length; row_index++) {
      for (let index = 0; index < this.#grid[row_index].length; index++) {
        if ((index == shipCoord.start[0] || index == shipCoord.end[0]) &&
          this.#grid[row_index][index] == "*") {
          return true;
        }
      }
    }
    return false;
  }

  placeOnGrid(ship_coord, orientation) {
    //if orientation is vertical, range from start y axis to end y axis
    //if orientation is horizontal, range from start x axis to end x axis
    if (orientation == "v") {
      for (let i = ship_coord.start[1]; i <= ship_coord.end[1]; i++) {
        this.#grid[i][ship_coord.start[0]] = "*";
      }
    } else if (orientation == "h") {
      for (let i = ship_coord.start[0]; i <= ship_coord.end[0]; i++) {
        this.#grid[ship_coord.start[1]][i] = "*";
      }
    }
  }

  validateCoordinates(shipCoord) {
    for (let coord of Object.values(shipCoord)) {
      let validate = this.validateOutOfBounds(coord);
      if (!validate) throw new Error("invalid coordinates");
    }

    let isOverlap = this.isOverlapping(shipCoord);
    if (isOverlap) throw new Error('ships overlap');
  }

  placeShip(ship_obj, starting_coord, orientation) {
    const endCoord = this.findEndCoord(ship_obj.length, starting_coord, orientation);
    const shipCoord = {
      start: starting_coord,
      end: endCoord
    }

    this.validateCoordinates(shipCoord);
    this.#boardObj.ships.push([ship_obj, shipCoord]);
    this.placeOnGrid(shipCoord, orientation)
    return endCoord;
  }
}

export { Gameboard };
