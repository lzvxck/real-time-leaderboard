export class Counter {
  private value = 0;

  increment(by = 1) {
    this.value += by;
    return this.value;
  }

  get() {
    return this.value;
  }
}

export const incrementCount = new Counter();
