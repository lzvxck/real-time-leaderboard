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

  // Used when a shard splits: the two new shards should not silently reset
  // to zero in-flight, or a burst mid-split could blow past maxInFlight
  // across the pair before either guard notices.
  fork(): BackpressureGuard {
    const shared = new BackpressureGuard(this.maxInFlight);
    shared.inFlight = this.inFlight;
    return shared;
  }
}
