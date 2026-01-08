class Grid {
  constructor() {
    this.SHIPS = [
      { id: 1, ship: "Ship 1 (4)", length: 4, placed: false, color: "#e74c3c" }, //red
      { id: 2, ship: "Ship 2 (3)", length: 3, placed: false, color: "#e67e22" }, //orange
      { id: 3, ship: "Ship 3 (3)", length: 3, placed: false, color: "#f1c40f" }, //yellow
      { id: 4, ship: "Ship 4 (2)", length: 2, placed: false, color: "#2ecc71" }, //green
      { id: 5, ship: "Ship 5 (2)", length: 2, placed: false, color: "#1abc9c" }, //teal
      { id: 6, ship: "Ship 6 (2)", length: 2, placed: false, color: "#3498db" }, //blue
      { id: 7, ship: "Ship 7 (1)", length: 1, placed: false, color: "#9b59b6" }, //purple
      { id: 8, ship: "Ship 8 (1)", length: 1, placed: false, color: "#34495e" }, //dark blue
      { id: 9, ship: "Ship 9 (1)", length: 1, placed: false, color: "#7f8c8d" }, //grey
      { id: 10, ship: "Ship 10 (1)", length: 1, placed: false, color: "#ff66cc" }, //pink
    ];
    this.currentBlockLength = this.SHIPS[0].length;
    this.currentShipIndex = 0;
    this.defaultOrientation = 'h';
    this.mainContainer = document.querySelector("#main-container");
    this.grid = document.createElement('div');
    this.rotateButton = document.createElement('button');

    // Rotate Button
    this.rotateButton.innerText = "Rotate";
    this.rotateButton.classList.add("rotate");
  }

  #isAllPlaced() {
    let allPlaced = true;
    this.SHIPS.forEach((ship) => {
      if (!ship.placed) allPlaced = false;
    })

    return allPlaced;
  }

  initialiseGrid() {
    this.grid.classList.add('grid');
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.setAttribute("data-row-index", `${row}`);
        cell.setAttribute("data-column-index", `${column}`);
        this.grid.appendChild(cell);
      }
    }

    this.mainContainer.appendChild(this.rotateButton);
    this.mainContainer.appendChild(this.grid);
  }

  initialiseAvailableShipBlocks() {
    const shipList = document.createElement('div');
    shipList.classList.add('ship-list');


    this.SHIPS.forEach((blockInfo, index) => {
      const button = document.createElement('button');
      button.innerText = blockInfo.ship;
      button.setAttribute("data-shipindex", index);
      if (index == this.currentShipIndex) {
        button.classList.add('btn-selected');
      }

      if (blockInfo.placed) {
        button.classList.add("placed");
        button.disabled = true;
      }

      button.addEventListener('click', () => {
        if (this.currentShipIndex != null || this.currentShipIndex != undefined) {
          let selectedButton = shipList.querySelector(`[data-shipindex="${this.currentShipIndex}"]`)
          selectedButton.classList.remove("btn-selected");
        }
        if (!this.SHIPS[index].placed) {
          button.classList.add("btn-selected");
          this.selectedButton = button;
          this.currentShipIndex = index;
          this.currentBlockLength = this.SHIPS[index].length;
        }
      });

      shipList.appendChild(button);
    });

    this.mainContainer.appendChild(shipList);
  }

  #resetHovered() {
    const children = this.grid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].classList.remove("hovered");
      children[i].classList.remove("hovered-error");
    }
  }

  #rotateBlock(current_orientation) {
    if (current_orientation == "h") {
      return "v";
    }
    else {
      return "h";
    }
  }

  #highlightCell(set_hover, grid_spaces) {
    let error = false;

    if (!this.currentBlockLength) error = true;
    if (this.SHIPS[this.currentShipIndex].placed) error = true;

    let allFilled = this.grid.querySelectorAll('.filled');
    for (const cell of allFilled) {
      const filledRowIndex = Number(cell.getAttribute('data-row-index'));
      const filledColumnIndex = Number(cell.getAttribute('data-column-index'));

      for (const hoverCell of set_hover) {
        if (
          hoverCell.row_index === filledRowIndex &&
          hoverCell.column_index === filledColumnIndex
        ) {
          error = true;
          break;
        }
      }
    }

    if (set_hover.length < grid_spaces) {
      error = true;
    }

    for (let item of set_hover) {
      if (error == true) {
        let cell = this.grid.querySelector(
          `[data-row-index="${item.row_index}"][data-column-index="${item.column_index}"]`
        );
        cell.classList.add("hovered-error");
      } else {

        let cell = this.grid.querySelector(
          `[data-row-index="${item.row_index}"][data-column-index="${item.column_index}"]`
        );
        if (!cell.classList.contains("filled")) cell.classList.add("hovered");
      }
    }
  }

  #blockPreview(orientation) {
    this.rotateButton.addEventListener('click', () => {
      orientation = this.#rotateBlock(orientation);
    });

    this.grid.addEventListener('mouseleave', () => {
      for (let i = 0; i < this.grid.children.length; i++) {
        if (this.grid.children[i].classList.contains("hovered") || this.grid.children[i].classList.contains("hovered-error")) {
          this.grid.children[i].classList.remove("hovered");
          this.grid.children[i].classList.remove("hovered-error");
        }
      }
    })

    this.grid.addEventListener("mouseover", (event) => {
      if (!event.target.getAttribute("data-row-index")) return false;
      this.#resetHovered();
      let difference = this.currentBlockLength - 1;
      let target_coords = {
        row_index: Number(event.target.getAttribute("data-row-index")),
        column_index: Number(event.target.getAttribute('data-column-index')),
      };

      let setHover = [target_coords];
      for (let i = 1; i <= difference; i++) {
        let newCell = {};
        if (orientation == "h") {
          const next_column =
            Number(event.target.getAttribute("data-column-index")) + i;
          if (
            this.grid.querySelector(
              `[data-row-index="${target_coords.row_index}"][data-column-index="${next_column}"]`
            )
          ) {
            newCell = {
              row_index: target_coords.row_index,
              column_index: next_column,
            };
          } else break;
        } else {
          const next_row = Number(event.target.getAttribute("data-row-index")) + i;

          if (
            this.grid.querySelector(
              `[data-row-index="${next_row}"][data-column-index="${target_coords.column_index}"]`
            )
          ) {
            newCell = {
              row_index: next_row,
              column_index: target_coords.column_index,
            };
          } else break;
        }
        setHover.push(newCell);
      }

      let allPlaced = this.#isAllPlaced();

      if (!allPlaced) this.#highlightCell(setHover, this.currentBlockLength);
    });
  }

  #addBlockPlacement() {
    const shipList = document.querySelector('.ship-list');
    const grid = document.querySelector('.grid');
    grid.addEventListener('click', (event) => {
      const ship = this.SHIPS[this.currentShipIndex];
      if (!event.target.classList.contains('hovered-error')) {
        const targetShip = shipList.querySelector(`[data-shipindex="${this.currentShipIndex}"]`)
        targetShip.classList.remove('btn-selected');
        targetShip.classList.add('placed');
        this.SHIPS[this.currentShipIndex].placed = true;
        const hoveredBlocks = document.querySelectorAll('.hovered');
        for (let cell of hoveredBlocks) {
          cell.classList.remove('hovered');
          cell.classList.add('filled');

          cell.dataset.shipid = ship.id;
          cell.style.backgroundColor = ship.color;
        }

        this.#goToNextBlock();
      }

    });
  }

  #goToNextBlock() {
    const shipList = document.querySelector('.ship-list');

    if (this.#isAllPlaced() == true) return false;
    if ((!this.SHIPS[this.currentShipIndex + 1]) || (this.SHIPS[this.currentShipIndex + 1].placed)) {
      for (let i = 0; i < this.SHIPS.length; i++) {
        if (!this.SHIPS[i].placed) {
          this.currentShipIndex = i;
          break;
        }
      }
    } else if (this.SHIPS[this.currentShipIndex + 1]) {
      this.currentShipIndex++;
    }

    this.currentBlockLength = this.SHIPS[this.currentShipIndex].length;
    let selectedButton = shipList.querySelector(`[data-shipindex="${this.currentShipIndex}"]`)
    selectedButton.classList.add('btn-selected');
  }

  mouseEvents() {
    this.#blockPreview(this.defaultOrientation);
    this.#addBlockPlacement();
  }

  startEvent() {
    this.initialiseAvailableShipBlocks();
    this.initialiseGrid();
    this.mouseEvents();
  }
}



const newGrid = new Grid;
newGrid.startEvent();



