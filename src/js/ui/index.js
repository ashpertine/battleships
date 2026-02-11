import { GridEditor } from "./gb_editor.js";
import { Game } from "./gameplay.js";
import { Computer } from "../computer.js"
import { changeCssStyle } from "./helpers.js"


class GameController {
  startSetup() {
    const newGridEditor = new GridEditor;

    newGridEditor.onComplete = (player_gameboard) => {
      this.transitionToGameplay(player_gameboard);
    };
    newGridEditor.startEvent();
  }

  transitionToGameplay(player_gameboard) {
    this.cleanup();
    changeCssStyle('gameplay-style');
    this.startGameplay(player_gameboard);
  }

  startGameplay(player_gameboard) {
    const newGame = new Game(player_gameboard);
    newGame.start()
  }

  cleanup() {
    const mainContainer = document.querySelector("#main-container");
    while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
    }
  }
}

const gameController = new GameController;
gameController.startSetup()

