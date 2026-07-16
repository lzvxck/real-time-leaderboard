import { Leaderboard } from "./leaderboard";

export type RegionUpdate = { key: string; amount: number; at: number };

export class ReplicatedRegions {
  readonly primary = new Leaderboard();
  readonly secondary = new Leaderboard();
  private lastWriteAt = new Map<string, number>();

  private applyIfNewer(region: Leaderboard, update: RegionUpdate) {
    const last = this.lastWriteAt.get(update.key) ?? 0;
    // Conflict resolution: whichever write has the later local timestamp wins.
    if (update.at < last) return;
    this.lastWriteAt.set(update.key, update.at);
    region.increment(update.key, update.amount);
  }

  incrementPrimary(key: string, amount = 1) {
    const update = { key, amount, at: Date.now() };
    this.applyIfNewer(this.primary, update);
    this.applyIfNewer(this.secondary, update);
    return this.primary.score(key);
  }

  incrementSecondary(key: string, amount = 1) {
    const update = { key, amount, at: Date.now() };
    this.applyIfNewer(this.secondary, update);
    this.applyIfNewer(this.primary, update);
    return this.secondary.score(key);
  }
}
