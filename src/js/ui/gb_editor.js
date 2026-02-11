// needed for creating the internal gameboard
import { Gameboard } from "../gameboard.js";
import { Ship } from "../ship.js";
import { SHIP_LIST } from "../helpers.js";
import Battleship from "../../images/battleship.png";
import BattleshipRotated from "../../images/battleship_rotated.png"


import "../../css/style.css";

class GridEditor {
  #internalGameboard;
  constructor() {
    this.SHIPS = [...SHIP_LIST];

    this.placedShipInfo = []; // contains starting_coordinates, and orientation
    this.currentBlockLength = this.SHIPS[0].length;
    this.currentShipIndex = 0;
    this.currentOrientation = 'h';

    this.#internalGameboard = new Gameboard();
    this.onComplete = null // will be assigned callback

    // DOM
    document.body.classList.add("editor-style");
    this.mainContainer = document.querySelector("#main-container");
    this.buttonGridContainer = document.createElement("div");
    this.buttonGridContainer.classList.add('button-grid-container');
    this.grid = document.createElement('div');

    // Buttons
    this.buttons = document.createElement('div');
    this.buttons.classList.add("buttons-container");

    this.rotateButton = document.createElement('button');
    this.rotateButton.innerText = "Rotate";
    this.rotateButton.classList.add("rotate");

    this.startButton = document.createElement('button');
    this.startButton.innerText = "Start Game!";
    this.startButton.classList.add("start-game");

    this.buttons.append(this.rotateButton);
  }

  get gameboard() {
    return this.#internalGameboard;
  }

  #isAllPlaced() {
    let allPlaced = true;
    this.SHIPS.forEach((ship) => {
      if (!ship.placed) allPlaced = false;
    })

    return allPlaced;
  }

  #initialiseGrid() {
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

    this.buttonGridContainer.appendChild(this.buttons);
    this.buttonGridContainer.appendChild(this.grid);
    this.mainContainer.append(this.buttonGridContainer);
  }

  #initialiseAvailableShipBlocks() {
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

  #addInputEventListeners() {
    this.rotateButton.addEventListener('click', () => {
      this.currentOrientation = this.#rotateBlock(this.currentOrientation);
    });

    this.startButton.addEventListener('click', () => {
      const allGridCells = this.grid.children;
      for (let cell of allGridCells) {
        if (cell.getAttribute("data-start") === "true" && cell.getAttribute("data-orientation") && cell.getAttribute("data-length")) {
          let startingCoords = [Number(cell.getAttribute("data-column-index")), Number(cell.getAttribute("data-row-index"))];
          let orientation = cell.getAttribute("data-orientation");
          let length = Number(cell.getAttribute("data-length"));

          // create a new ship
          const newShip = new Ship(length);
          this.#internalGameboard.placeShip(newShip, startingCoords, orientation);
        }
      }
      if (this.onComplete) {
        this.onComplete(this.gameboard);
      }
    });
  }

  #blockPreview() {
    this.grid.addEventListener('mouseleave', () => {
      for (let i = 0; i < this.grid.children.length; i++) {
        if (this.grid.children[i].classList.contains("hovered") || this.grid.children[i].classList.contains("hovered-error")) {
          this.grid.children[i].classList.remove("hovered");
          this.grid.children[i].classList.remove("hovered-error");
        }
      }
    })

    this.grid.addEventListener("mouseover", (event) => {
      if (!event.target.classList.contains("grid-cell")) return false;
      this.#resetHovered();
      let difference = this.currentBlockLength - 1;
      let target_coords = {
        row_index: Number(event.target.getAttribute("data-row-index")),
        column_index: Number(event.target.getAttribute('data-column-index')),
      };

      let setHover = [target_coords];
      for (let i = 1; i <= difference; i++) {
        let newCell = {};
        if (this.currentOrientation == "h") {
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

  #addShipImage(start_x, start_y) {
    const cellWidth = 36;
    const gap = 4;
    const padding = 8;
    const battleshipIcon = new Image();

    // dont ask how i got these calculations
    if (this.currentOrientation == 'h') {
      battleshipIcon.src = Battleship;
      battleshipIcon.classList.add("battleship-icon");
      let width = (cellWidth * this.currentBlockLength) + (gap * (this.currentBlockLength - 1));
      let height = cellWidth;
      let topGap = padding + (start_y * (cellWidth + gap)) + 4;
      let leftGap = padding + (start_x * (cellWidth + gap)) + 4;

      battleshipIcon.style.maxWidth = `${width}px`;
      battleshipIcon.style.maxHeight = `${height}px`;
      battleshipIcon.style.top = `${topGap}px`;
      battleshipIcon.style.left = `${leftGap}px`;
    }
    else {
      battleshipIcon.src = BattleshipRotated;
      battleshipIcon.classList.add("battleship-icon");
      let width = cellWidth;
      let height = (cellWidth * this.currentBlockLength) + (gap * (this.currentBlockLength - 1));
      let topGap = padding + (start_y * (cellWidth + gap)) + 2;
      let leftGap = padding + (start_x * (cellWidth + gap)) + 2;

      battleshipIcon.style.maxWidth = `${width}px`;
      battleshipIcon.style.maxHeight = `${height}px`;
      battleshipIcon.style.top = `${topGap}px`;
      battleshipIcon.style.left = `${leftGap}px`;
    }

    this.grid.append(battleshipIcon);
  }

  #addBlockPlacement() {
    const shipList = document.querySelector('.ship-list');
    const grid = document.querySelector('.grid');
    grid.addEventListener('click', (event) => {
      if (!event.target.classList.contains('grid-cell')) return false;
      const ship = this.SHIPS[this.currentShipIndex];
      if (!event.target.classList.contains('hovered-error') && !this.#isAllPlaced()) {
        //get target ship info
        let startX = event.target.getAttribute('data-column-index');
        let startY = event.target.getAttribute('data-row-index');

        //edit target ship button
        const targetShip = shipList.querySelector(`[data-shipindex="${this.currentShipIndex}"]`)
        targetShip.classList.remove('btn-selected');
        targetShip.classList.add('placed');
        this.SHIPS[this.currentShipIndex].placed = true;

        //tag the starting coordinate of ship
        event.target.dataset.start = true
        event.target.dataset.orientation = this.currentOrientation;
        event.target.dataset.length = this.currentBlockLength;

        //place blocks
        const hoveredBlocks = document.querySelectorAll('.hovered');
        for (let cell of hoveredBlocks) {
          cell.classList.remove('hovered');
          cell.classList.add('filled');

          cell.dataset.shipid = ship.id;
          cell.classList.add(ship.color);
        }

        this.#addShipImage(startX, startY);

        if (this.#isAllPlaced()) {
          this.buttons.append(this.startButton);
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


  startEvent() {
    this.#initialiseAvailableShipBlocks();
    this.#initialiseGrid();
    this.#blockPreview();
    this.#addInputEventListeners();
    this.#addBlockPlacement();
  }
}

export { GridEditor }



