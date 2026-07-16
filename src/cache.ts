export class TtlCache<T> {
  private value: T | undefined;
  private expiresAt = 0;

  constructor(private readonly ttlMs: number) {}

  get(compute: () => T): T {
    const now = Date.now();
    if (this.value === undefined || now >= this.expiresAt) {
      this.value = compute();
      this.expiresAt = now + this.ttlMs;
    }
    return this.value;
  }

  invalidate() {
    this.expiresAt = 0;
  }
}
