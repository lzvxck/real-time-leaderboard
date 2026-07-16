import { Leaderboard } from "./leaderboard";

function hash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

const REPLICAS_PER_SHARD = 2;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ShardedLeaderboard {
  private shards: Leaderboard[];
  private replicas: Leaderboard[][];

  constructor(shardCount = 8) {
    this.shards = Array.from({ length: shardCount }, () => new Leaderboard());
    this.replicas = this.shards.map(() =>
      Array.from({ length: REPLICAS_PER_SHARD }, () => new Leaderboard()),
    );
  }

  private index(key: string): number {
    return hash(key) % this.shards.length;
  }

  async increment(key: string, amount = 1): Promise<number> {
    const idx = this.index(key);
    const score = this.shards[idx].increment(key, amount);
    // Fan out to every replica synchronously so reads never see a stale replica.
    for (const replica of this.replicas[idx]) {
      await delay(1); // simulates the network hop to a replica
      replica.increment(key, amount);
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
