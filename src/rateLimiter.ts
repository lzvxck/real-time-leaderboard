export class RateLimiter {
  private tokens = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit = 50,
    private readonly windowMs = 1_000,
  ) {}

  allow(key: string): boolean {
    const now = Date.now();
    const bucket = this.tokens.get(key);
    if (!bucket || bucket.resetAt <= now) {
      this.tokens.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (bucket.count >= this.limit) return false;
    bucket.count++;
    return true;
  }
}
