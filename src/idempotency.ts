export class IdempotencyStore {
  private seen = new Map<string, number>();

  constructor(private readonly ttlMs = 60_000) {}

  private sweep() {
    const now = Date.now();
    for (const [key, expiresAt] of this.seen) {
      if (expiresAt <= now) this.seen.delete(key);
    }
  }

  hasSeen(key: string): boolean {
    this.sweep();
    return this.seen.has(key);
  }

  remember(key: string) {
    this.seen.set(key, Date.now() + this.ttlMs);
  }
}
