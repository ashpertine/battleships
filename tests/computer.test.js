import { Computer } from '../src/js/computer.js';
import { SHIP_LIST } from '../src/js/helpers.js';

describe('Computer', () => {
  let computer;

  beforeEach(() => {
    computer = new Computer();
  });

  describe('populateGameboard', () => {
    test('places all ships on the gameboard', () => {
      computer.populateGameboard();

      const gameboard = computer.gameboard;

      // Count how many ships are actually on the board
      let actualShipCount = 0;
      for (let i = 0; i < gameboard.grid.length; i++) {
        for (let j = 0; j < gameboard.grid[i].length; j++) {
          if (gameboard.grid[i][j] !== 'e') {
            actualShipCount++;
          }
        }
      }

      // Total cells occupied should equal sum of all ship lengths
      const expectedCells = SHIP_LIST.reduce((sum, ship) => sum + ship.length, 0);
      expect(actualShipCount).toBe(expectedCells);
    });

    test('successfully populates board multiple times without errors', () => {
      // Run multiple times to test randomness
      for (let i = 0; i < 10; i++) {
        const testComputer = new Computer();
        expect(() => testComputer.populateGameboard()).not.toThrow();
      }
    });
  });
});
