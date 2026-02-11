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

  #validateOutOfBounds(coordinates) {
    if ((coordinates[0] < 0 || coordinates[1] < 0) ||
      (!this.#grid[coordinates[0]]) ||
      (!this.#grid[coordinates[0]][coordinates[1]])) {
      return false;
    }

    return true
  }

  #findEndCoord(ship_length, starting_coord, orientation) {
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

  #isOverlapping(shipCoord) {
    if (shipCoord.start[0] == shipCoord.end[0]) {  //vertical 
      for (let y = shipCoord.start[1]; y <= shipCoord.end[1]; y++) {
        if (this.#grid[y][shipCoord.start[0]] !== 'e') return true;
      }
    } else { //horizontal
      for (let x = shipCoord.start[0]; x <= shipCoord.end[0]; x++) {
        if (this.#grid[shipCoord.start[1]][x] !== 'e') return true;
      }
    }

    return false;
  }

  #placeOnGrid(ship_index, ship_coord, orientation) {
    //if orientation is vertical, range from start y axis to end y axis
    //if orientation is horizontal, range from start x axis to end x axis
    if (orientation == "v") {
      for (let i = ship_coord.start[1]; i <= ship_coord.end[1]; i++) {
        this.#grid[i][ship_coord.start[0]] = { [`ship_${ship_index}`]: "*" };
      }
    } else if (orientation == "h") {
      for (let i = ship_coord.start[0]; i <= ship_coord.end[0]; i++) {
        this.#grid[ship_coord.start[1]][i] = { [`ship_${ship_index}`]: "*" };
      }
    }
  }

  #validateCoordinates(shipCoord) {
    for (let coord of Object.values(shipCoord)) {
      let validate = this.#validateOutOfBounds(coord);
      if (!validate) throw new Error("invalid coordinates");
    }

    let isOverlap = this.#isOverlapping(shipCoord);
    if (isOverlap) throw new Error('ships overlap');
  }

  placeShip(ship_obj, starting_coord, orientation) {
    const endCoord = this.#findEndCoord(ship_obj.length, starting_coord, orientation);
    const shipCoord = {
      start: starting_coord,
      end: endCoord
    }

    this.#validateCoordinates(shipCoord);
    const shipIndex = this.#boardObj.ships.length + 1;
    const shipName = `ship_${shipIndex}`;
    this.#boardObj.ships.push({
      name: shipName,
      id: shipIndex,
      shipObj: ship_obj,
      coords: shipCoord
    });
    this.#placeOnGrid(shipIndex, shipCoord, orientation)
    return endCoord;
  }

  receiveAttack(attack_coords) {
    if (!this.#validateOutOfBounds(attack_coords)) throw new Error("attack is out of bounds");
    if (Object.values(this.#grid[attack_coords[1]][attack_coords[0]])[0] == "*") { //the coordinate index are reversed because
      let shipName = Object.keys(this.#grid[attack_coords[1]][attack_coords[0]])[0]; //the grid slicing starts with row then column
      this.#grid[attack_coords[1]][attack_coords[0]][`${shipName}`] = 'h'; // h for hit
      for (const ship of this.#boardObj.ships) {
        if (ship.name == shipName) {
          ship.shipObj.hit();
        }
      }
      return (`${shipName} has been hit!`);
    }

    this.#grid[attack_coords[1]][attack_coords[0]] = 'm'; //m for 'missed'
    return "missed!";
  }

  hasAllSunk() {
    for (let i = 0; i < this.#boardObj.ships.length; i++) {
      if (!this.#boardObj.ships[i].shipObj.isSunk()) {
        return false;
      }
    }

    return true;
  }

}

export { Gameboard };
