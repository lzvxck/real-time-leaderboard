export class BackpressureGuard {
  private inFlight = 0;

  constructor(private readonly maxInFlight = 1_000) {}

  tryEnter(): boolean {
    if (this.inFlight >= this.maxInFlight) return false;
    this.inFlight++;
    return true;
  }

  leave() {
    this.inFlight = Math.max(0, this.inFlight - 1);
  }
}
