import { Gameboard } from '../src/gameboard.js'
import { Ship } from '../src/ship.js'

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
        [ship, { start: [1, 3], end: [1, 5] }]
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

  test('placing ships on grid works', () => {
    let ship = new Ship(3)
    let gameboard = new Gameboard();
    gameboard.placeShip(ship, [1, 3], 'v');
    gameboard.placeShip(ship, [3, 5], 'h');
    expect(gameboard.grid).toStrictEqual([['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', '*', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', '*', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', '*', 'e', '*', '*', '*', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ])
  })
})
