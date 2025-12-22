class Ship {
  #noOfTimesHit;
  #length;
  constructor(length) {
    if (!Number.isInteger(length)) throw new Error('length must be int');
    this.#length = length;
    this.#noOfTimesHit = 0;
  }

  hit() {
    this.#noOfTimesHit++
  }

  get length() {
    return this.#length;
  }
  get hits() {
    return this.#noOfTimesHit;
  }

  isSunk() {
    return this.#noOfTimesHit === this.length;
  }
}


export { Ship };
