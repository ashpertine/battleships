import { Player } from "../src/js/player.js";


describe('test player class', () => {
  test('initialising player with non human or non computer type throws error', () => {
    expect(() => {
      let player = new Player('wow');
    }).toThrow('player must be initialised with either type "human" or type "computer"');
  })

  test('initialising player with valid type', () => {
    let player = new Player("computer");
    expect(player.type).toBe("computer");
  });
});
