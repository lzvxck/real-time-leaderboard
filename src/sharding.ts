import { Leaderboard } from "./leaderboard";
import { REBALANCE_THRESHOLD, splitShard } from "./rebalance";

function hash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export class ShardedLeaderboard {
  private shards: Leaderboard[];
  private keyCounts: number[];

  constructor(shardCount = 8) {
    this.shards = Array.from({ length: shardCount }, () => new Leaderboard());
    this.keyCounts = Array.from({ length: shardCount }, () => 0);
  }

  private index(key: string): number {
    return hash(key) % this.shards.length;
  }

  increment(key: string, amount = 1): number {
    const idx = this.index(key);
    const shard = this.shards[idx];
    const isNewKey = shard.score(key) === 0;
    const score = shard.increment(key, amount);
    if (isNewKey) this.keyCounts[idx]++;

    if (this.keyCounts[idx] >= REBALANCE_THRESHOLD) {
      // Read the shard's current contents and swap in two fresh halves.
      // Any increment that lands on `shard` between this read and the
      // reassignment below is applied to an object nobody references anymore.
      const entries = shard.topN(Number.MAX_SAFE_INTEGER);
      const [left, right] = splitShard(entries);
      this.shards[idx] = left;
      this.shards.push(right);
      this.keyCounts[idx] = Math.floor(this.keyCounts[idx] / 2);
      this.keyCounts.push(this.keyCounts[idx]);
    }

    return score;
  }

  score(key: string): number {
    return this.shards[this.index(key)].score(key);
  }

  topN(n: number): Array<{ key: string; score: number }> {
    return this.shards
      .flatMap((shard) => shard.topN(n))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }
}
