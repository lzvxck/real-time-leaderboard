import { Leaderboard } from "./leaderboard";

export const REBALANCE_THRESHOLD = 10_000;

export function shouldRebalance(shard: Leaderboard, keyCount: number): boolean {
  return keyCount >= REBALANCE_THRESHOLD;
}

export function splitShard(entries: Array<{ key: string; score: number }>): [Leaderboard, Leaderboard] {
  const left = new Leaderboard();
  const right = new Leaderboard();
  entries.forEach((entry, i) => {
    const target = i % 2 === 0 ? left : right;
    target.increment(entry.key, entry.score);
  });
  return [left, right];
}
