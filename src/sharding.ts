import { Leaderboard } from "./leaderboard";

function hash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export class ShardedLeaderboard {
  private shards: Leaderboard[];

  constructor(shardCount = 8) {
    this.shards = Array.from({ length: shardCount }, () => new Leaderboard());
  }

  private shardFor(key: string): Leaderboard {
    return this.shards[hash(key) % this.shards.length];
  }

  increment(key: string, amount = 1): number {
    return this.shardFor(key).increment(key, amount);
  }

  score(key: string): number {
    return this.shardFor(key).score(key);
  }

  topN(n: number): Array<{ key: string; score: number }> {
    return this.shards
      .flatMap((shard) => shard.topN(n))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }
}
