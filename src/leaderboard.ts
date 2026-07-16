export class Leaderboard {
  private scores = new Map<string, number>();

  increment(key: string, amount = 1): number {
    const next = (this.scores.get(key) ?? 0) + amount;
    this.scores.set(key, next);
    return next;
  }

  score(key: string): number {
    return this.scores.get(key) ?? 0;
  }

  topN(n: number): Array<{ key: string; score: number }> {
    return [...this.scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key, score]) => ({ key, score }));
  }
}
