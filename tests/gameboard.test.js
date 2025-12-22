import { Gameboard } from '../src/js/gameboard.js'
import { Ship } from '../src/js/ship.js'

describe('test gameboard', () => {
  test('gameboard class exists', () => {
    let gameboard = new Gameboard();
    expect(gameboard.board).toStrictEqual({ ships: [] })
  })

  test('can place ship on gameboard vertically', () => {
    let ship = new Ship(3)
    let gameboard = new Gameboard();
    // placeShip takes the ship, starting coordinates, and vertical or horizontal, expect placeShip to return the end coordinates of the ship
    expect(gameboard.placeShip(ship, [1, 3], 'v')).toStrictEqual([1, 5])
  })

  test('can place ship on gameboard horizontally', () => {
    let ship = new Ship(3)
    let gameboard = new Gameboard();
    // placeShip takes the ship, starting coordinates, and vertical or horizontal, expect placeShip to return the end coordinates of the ship
    expect(gameboard.placeShip(ship, [1, 2], 'h')).toStrictEqual([3, 2])
  })

  test('boardObj gets updated when ship is placed', () => {
    let ship = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [1, 3], 'v');
    expect(gameboard.board).toStrictEqual({
      ships: [
        {
          name: 'ship_1',
          shipObj: ship,
          coords: { start: [1, 3], end: [1, 5] }
        }
      ]
    })
  })

  test('throw error when invalid coordinate is provided', () => {
    expect(() => {
      let ship = new Ship(3)
      let gameboard = new Gameboard();
      gameboard.placeShip(ship, [9, 0], 'h');
    }).toThrow('invalid coordinates');
  })

  test('throw error when invalid coordinate is provided (vertical)', () => {
    expect(() => {
      let ship = new Ship(3)
      let gameboard = new Gameboard();
      gameboard.placeShip(ship, [1, -1], 'v');
    }).toThrow('invalid coordinates');
  })

  test('throw error when ships overlap', () => {
    expect(() => {
      let ship = new Ship(3)
      let ship1 = new Ship(2)
      let gameboard = new Gameboard();
      gameboard.placeShip(ship, [0, 0], 'v');
      gameboard.placeShip(ship1, [0, 1], 'h');
    }).toThrow('ships overlap');
  })

  test('throw error when ships overlap part 2', () => {
    expect(() => {
      let ship = new Ship(3)
      let ship1 = new Ship(4)
      let gameboard = new Gameboard();
      gameboard.placeShip(ship, [6, 5], 'v');
      gameboard.placeShip(ship1, [3, 6], 'h');
    }).toThrow('ships overlap');
  })

  test("interior vertical/horizontal overlap is missed by isOverlapping", () => {
    const board = new Gameboard();
    const shipA = new Ship(3);
    const shipB = new Ship(3);
    board.placeShip(shipA, [5, 4], 'v');
    expect(() => {
      board.placeShip(shipB, [4, 5], 'h');
    }).toThrow('ships overlap'); // <-- this expectation will FAIL with current isOverlapping
  });

  test('placing ships on grid works', () => {
    let ship = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [1, 3], 'v');
    gameboard.placeShip(ship, [3, 5], 'h');
    expect(gameboard.grid).toStrictEqual([['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', { ship_1: '*' }, 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', { ship_1: '*' }, 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', { ship_1: '*' }, 'e', { ship_2: '*' }, { ship_2: '*' }, { ship_2: '*' }, 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ])
  })


  test('receiveAttack hits corrects ship', () => {
    let ship = new Ship(3)
    let ship2 = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [1, 3], 'v');
    gameboard.placeShip(ship2, [3, 5], 'h');

    expect(gameboard.receiveAttack([3, 5])).toBe('ship_2 has been hit!');
  })

  test('receiveAttack hit marks with h', () => {
    let ship = new Ship(3)
    let ship2 = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [2, 4], 'v');
    gameboard.placeShip(ship2, [6, 7], 'h');
    gameboard.receiveAttack([6, 7]);
    expect(Object.values(gameboard.grid[7][6])[0]).toBe('h');
  })

  test('receiveAttack increases ship hit count', () => {
    let ship = new Ship(3)
    let ship2 = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [2, 4], 'v');
    gameboard.placeShip(ship2, [6, 7], 'h');
    gameboard.receiveAttack([6, 7]);
    expect(ship2.hits).toBe(1);
  })

  test('receiveAttack misses marks with m', () => {
    let ship = new Ship(3)
    let ship2 = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [2, 4], 'v');
    gameboard.placeShip(ship2, [6, 7], 'h');
    gameboard.receiveAttack([0, 2]);
    expect(gameboard.grid[2][0]).toBe('m');
  })

  test('throw error when invalid coordinate is input in receiveAttack', () => {
    expect(() => {
      let ship = new Ship(3)
      let gameboard = new Gameboard();
      gameboard.placeShip(ship, [4, 4], 'h');
      gameboard.receiveAttack([10, 0]);
    }).toThrow('attack is out of bounds');
  })

  test('hasAllSunk correctly checks of all ships have sunk', () => {
    let ship = new Ship(2);
    let ship2 = new Ship(2);
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [2, 4], 'v');
    gameboard.placeShip(ship2, [6, 7], 'h');
    gameboard.receiveAttack([2, 4]);
    gameboard.receiveAttack([2, 5]);
    gameboard.receiveAttack([6, 7]);
    gameboard.receiveAttack([7, 7]);
    expect(gameboard.hasAllSunk()).toBe(true);
  })

  test('hasAllSunk correctly checks of all ships have sunk (not all have sunk)', () => {
    let ship = new Ship(2);
    let ship2 = new Ship(2);
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [2, 4], 'v');
    gameboard.placeShip(ship2, [6, 7], 'h');
    gameboard.receiveAttack([2, 4]);
    gameboard.receiveAttack([2, 5]);
    gameboard.receiveAttack([6, 7]);
    expect(gameboard.hasAllSunk()).toBe(false);
  })
})
