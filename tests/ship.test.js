import { Ship } from "../src/ship.js"

describe('test Ship class', () => {
  let newShip = new Ship(4);
  test('initialise with correct length', () => {
    expect(newShip.length).toBe(4);
  });

  test('refuse intiialisation with non-int', () => {
    expect(() => {
      let newStringShip = new Ship('a');
    }).toThrow('length must be int');
  })

  test('noOfTimesHit matches expected number of hit() calls', () => {
    newShip.hit()
    newShip.hit()
    expect(newShip.hits).toBe(2);
  })

  test('isSunk return True when ship length is equal to no. of hits', () => {
    let newShip2 = new Ship(3)
    newShip2.hit();
    newShip2.hit();
    newShip2.hit();

    expect(newShip2.isSunk()).toBe(true);
  })
})
