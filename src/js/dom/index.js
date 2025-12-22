function initialiseGrid() {
  const mainContainer = document.querySelector("#main-container");
  const grid = document.createElement('div');
  const rotateButton = document.createElement('button');

  // Rotate Button
  rotateButton.innerText = "Rotate";
  rotateButton.classList.add("rotate");

  grid.classList.add('grid');
  for (let row = 0; row < 10; row++) {
    for (let column = 0; column < 10; column++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.setAttribute("data-row-index", `${row}`);
      cell.setAttribute("data-column-index", `${column}`);
      grid.appendChild(cell);
    }
  }

  mainContainer.appendChild(rotateButton);
  mainContainer.appendChild(grid);
}

function initialiseAvailableShipBlocks() {
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
  const mainContainer = document.querySelector('#main-container');
  const blockListDiv = document.createElement('div');
  const blockList = document.createElement('ul');
  blockListDiv.classList.add('ship-list');
  for (let block of SHIPS) {
    const blockLi = document.createElement('li');
    blockLi.innerText = block;
    blockList.appendChild(blockLi);
  }

  blockListDiv.appendChild(blockList);
  mainContainer.appendChild(blockListDiv);
}

function resetHovered() {
  const grid = document.querySelector('.grid');
  const children = grid.children;
  for (var i = 0; i < children.length; i++) {
    children[i].classList.remove("hovered");
    children[i].classList.remove("hovered-error");
  }
}

function rotateBlock(current_orientation) {
  if (current_orientation == "h") {
    return "v";
  }
  else {
    return "h";
  }
}

function highlightCell(set_hover, grid_spaces) {
  const grid = document.querySelector('.grid');
  let error = false;
  let allFilled = grid.querySelectorAll('.filled');
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

  for (object of set_hover) {
    if (error == true) {
      let cell = document.querySelector(
        `[data-row-index="${object.row_index}"][data-column-index="${object.column_index}"]`
      );
      if (!cell.classList.contains("filled")) cell.classList.add("hovered-error");
    } else {

      let cell = document.querySelector(
        `[data-row-index="${object.row_index}"][data-column-index="${object.column_index}"]`
      );
      if (!cell.classList.contains("filled")) cell.classList.add("hovered");
    }
  }

}

function blockPreview(grid_spaces, orientation) {
  const grid = document.querySelector('.grid');
  const rotateButton = document.querySelector('.rotate');

  rotateButton.addEventListener('click', () => {
    orientation = rotateBlock(orientation);
  });

  grid.addEventListener('mouseleave', () => {
    for (let i = 0; i < grid.children.length; i++) {
      if (grid.children[i].classList.contains("hovered")) {
        grid.children[i].classList.remove("hovered");
      }
    }
  })

  grid.addEventListener("mouseover", (event) => {
    resetHovered();
    let difference = grid_spaces - 1;
    let target_coords = {
      row_index: Number(event.target.getAttribute("data-row-index")),
      column_index: Number(event.target.getAttribute('data-column-index')),
    };

    let set_hover = [target_coords];
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

      set_hover.push(newCell);
    }

    highlightCell(set_hover, grid_spaces);
  });
}

function placeBlock() {
  const grid = document.querySelector('.grid');
  grid.addEventListener('click', () => {
    const hoveredBlocks = document.querySelectorAll('.hovered');
    for (cell of hoveredBlocks) {
      cell.classList.remove('hovered');
      cell.classList.add('filled');
    }
  });
}

function mouseEvents() {
  currentBlockLength = 4;
  defaultOrientation = 'h';
  blockPreview(currentBlockLength, defaultOrientation);
  placeBlock();
}

function startEvent() {
  initialiseAvailableShipBlocks();
  initialiseGrid();
  mouseEvents();
}

startEvent();
