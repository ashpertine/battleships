class Grid {
  constructor() {
    this.mainContainer = document.querySelector("#main-container");
    this.grid = document.createElement('div');
    this.rotateButton = document.createElement('button');

    // Rotate Button
    this.rotateButton.innerText = "Rotate";
    this.rotateButton.classList.add("rotate");
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
    const SHIPS = [
      "4-cell ship",

      "3-cell ship #1",
      "3-cell ship #2",

      "2-cell ship #1",
      "2-cell ship #2",
      "2-cell ship #3",

      "1-cell ship #1",
      "1-cell ship #2",
      "1-cell ship #3",
      "1-cell ship #4",
    ];
    const blockListDiv = document.createElement('div');
    const blockList = document.createElement('ul');
    blockListDiv.classList.add('ship-list');
    for (let block of SHIPS) {
      const blockLi = document.createElement('li');
      blockLi.innerText = block;
      blockList.appendChild(blockLi);
    }

    blockListDiv.appendChild(blockList);
    this.mainContainer.appendChild(blockListDiv);
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
        if (!cell.classList.contains("filled")) cell.classList.add("hovered-error");
      } else {

        let cell = this.grid.querySelector(
          `[data-row-index="${item.row_index}"][data-column-index="${item.column_index}"]`
        );
        if (!cell.classList.contains("filled")) cell.classList.add("hovered");
      }
    }
  }

  #blockPreview(grid_spaces, orientation) {
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
      this.#resetHovered();
      let difference = grid_spaces - 1;
      let target_coords = {
        row_index: Number(event.target.getAttribute("data-row-index")),
        column_index: Number(event.target.getAttribute('data-column-index')),
      };

      let setHover = [target_coords];
      for (let i = 1; i <= difference; i++) {
        let newCell = {};
        if (orientation == "h") {
          const next_column = Number(event.target.getAttribute('data-column-index')) + i;
          if (document.querySelector(`[data-row-index="${next_column}"]`)) {
            newCell = {
              row_index: Number(event.target.getAttribute('data-row-index')),
              column_index: next_column,
            };
          } else {
            break;
          }
        }
        else {
          const next_row = Number(event.target.getAttribute('data-row-index')) + i;
          if (document.querySelector(`[data-row-index="${next_row}"]`)) {
            newCell = {
              row_index: next_row,
              column_index: Number(event.target.getAttribute('data-column-index')),
            };
          } else {
            break;
          }
        }

        setHover.push(newCell);
      }

      this.#highlightCell(setHover, grid_spaces);
    });
  }

  #placeBlock() {
    const grid = document.querySelector('.grid');
    grid.addEventListener('click', () => {
      const hoveredBlocks = document.querySelectorAll('.hovered');
      for (let cell of hoveredBlocks) {
        cell.classList.remove('hovered');
        cell.classList.add('filled');
      }
    });
  }

  mouseEvents() {
    let currentBlockLength = 4;
    let defaultOrientation = 'h';
    this.#blockPreview(currentBlockLength, defaultOrientation);
    this.#placeBlock();
  }

  startEvent() {
    this.initialiseAvailableShipBlocks();
    this.initialiseGrid();
    this.mouseEvents();
  }
}



const newGrid = new Grid;
newGrid.startEvent();



