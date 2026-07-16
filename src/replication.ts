import { Leaderboard } from "./leaderboard";

export type RegionUpdate = { key: string; amount: number; at: number };

export class ReplicatedRegions {
  readonly primary = new Leaderboard();
  readonly secondary = new Leaderboard();
  private log: RegionUpdate[] = [];

  increment(key: string, amount = 1) {
    const score = this.primary.increment(key, amount);
    this.log.push({ key, amount, at: Date.now() });
    return score;
  }

  replicate() {
    for (const update of this.log) {
      this.secondary.increment(update.key, update.amount);
    }
    this.log = [];
  }
}
