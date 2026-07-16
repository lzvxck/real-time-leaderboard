import { describe, expect, it } from "vitest";
import { ShardedLeaderboard } from "../src/sharding";

describe("ShardedLeaderboard", () => {
  it("routes the same key to the same shard consistently", async () => {
    const board = new ShardedLeaderboard(4);
    await board.increment("alice", 1);
    await board.increment("alice", 2);
    expect(board.score("alice")).toBe(3);
  });

  it("aggregates topN across shards", async () => {
    const board = new ShardedLeaderboard(4);
    await board.increment("alice", 5);
    await board.increment("bob", 9);
    expect(board.topN(1)).toEqual([{ key: "bob", score: 9 }]);
  });
});
